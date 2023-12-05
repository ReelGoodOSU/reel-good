#!/usr/bin/env python3

from flask import Flask, jsonify, request
from elasticsearch import Elasticsearch
import time

# For testing purposes, we will want to change how this is stored in actual backend
ELASTIC_PASSWORD = "cse5914_capstone"

ES = Elasticsearch(
    "https://es01:9200",
    ca_certs="/app/certs/ca/ca.crt",
    basic_auth=("elastic", ELASTIC_PASSWORD),
)

app = Flask(__name__)


@app.route("/time")
def get_current_time():
    return {"time": time.time()}


@app.route("/movies/<movie_id>")
def get_movie_data(movie_id):
    global ES
    try:
        # send get query for movie ID
        resp = ES.get(index="movie", id=movie_id)
        return resp["_source"], 200
    except Exception as e:
        # log the exception
        print(f"Error fetching movie data: {e}")
        return {"error": "Error fetching movie data"}, 500


# Demo on how to get info from the elasticsearch client
@app.route("/info")
def get_elastic_info():
    global ES
    return ES.info(pretty=True).body


@app.route("/person/<id>")
def get_person(id):
    global ES
    try:
        # Send get query for actor ID
        resp = ES.get(
            index="person", id=id
        )  # Make sure "person" is the correct index for your actors
        return resp["_source"], 200
    except Exception as e:
        # Log the exception
        print(f"Error fetching actor data: {e}")
        return {"error": "Error fetching actor data"}, 500


@app.route("/search")
def search_elastic():
    """Perform a search, requires two parameters and one optional
    search_query - text used for the search
    search_by - Name of the index to search by
    size - max number of search entries to return
    """
    query = request.args.get("search_query")
    topic = request.args.get("search_by")
    size = request.args.get("size") or 25

    print(f"Backend Debug: search_query: {query}")
    print(f"Backend Debug: search_by: {topic}")

    if topic == "title":
        return search_movies_directly(topic, query, size)
    elif topic in {"production_company", "actor", "credits", "genres", "director"}:
        return search_movies_indirectly(topic, query, size)
    else:
        return search_movies_indirectly(topic, query, size)


def search_movies_directly(topic, query, size):
    # Send query and return the top size hits back (sorted by popularity so we actually
    # get good search results)
    resp = ES.search(
        index="movie",
        query={
            "match": {
                topic: {
                    "query": query,
                    "operator": "AND",
                    "minimum_should_match": "-1",
                    "fuzziness": "AUTO:5,10",
                    "fuzzy_transpositions": "false",
                },
            },
        },
        sort=[{"popularity": {"order": "desc"}}],
        size=size,
    )
    # No hits? Try again with OR matching
    if len(resp["hits"]["hits"]) == 0:
        resp = ES.search(
            index="movie",
            query={
                "match": {
                    topic: {
                        "query": query,
                        "operator": "OR",
                        "minimum_should_match": "-1",
                        "fuzziness": "AUTO:5,10",
                        "fuzzy_transpositions": "false",
                    },
                },
            },
            sort=[{"popularity": {"order": "desc"}}],
            size=size,
        )
    return resp["hits"]["hits"]


def search_movies_indirectly(topic, query, size):
    # fuzz search
    fuzz_fields = ["overview", "keywords"]
    if topic == "?":
        print("DEBUG: Entered ? search 1")
        resp = ES.search(
            index="movie",
            query={
                "multi_match": {
                    "query": query,
                    "fields": fuzz_fields,
                    "type": "best_fields",
                    "operator": "OR",
                    "fuzziness": "1",
                    "auto_generate_synonyms_phrase_query": "true",
                    "minimum_should_match": 2,
                }
            },
        )
        print("DEBUG: Entered ? search 2")
        return resp["hits"]["hits"]

    # Adjust index and field based on topic
    if topic == "production_company":
        index = "production_company"
        field = "name"
        id_field = f"{topic}_ids"
    elif topic == "credits" or topic == "actor":
        index = "person"
        field = "name"
        id_field = "credits.cast.id"
    elif topic == "genres":
        index = "genres"
        field = "name"
        id_field = "genre_ids"
        print(f"DEBUG: searched by genres")
    elif topic == "director":
        index = "person"
        field = "name"
        id_field = "credits.crew.id"
        print(f"DEBUG: searched by director")

    # Add more conditions for other topics
    ids = []
    # First search to get IDs if topic is production_company
    id_response = ES.search(
        index=index, query={"match": {field: {"query": query, "operator": "OR"}}}
    )
    ids = [hit["_id"] for hit in id_response["hits"]["hits"]]
    print(f"indirect_search-ids1: {ids}")

    # debug statements
    print(f"DEBUG:indirect_search-id_field: {id_field}")
    print(f"DEBUG:indirect_search-ids: {ids}")

    # Second search in movie index
    if topic == "director":
        return search_director(id_field, ids, size)

    resp = ES.search(
        index="movie",
        query={"terms": {id_field: ids}},
        sort=[{"popularity": {"order": "desc"}}],
        size=size,
    )
    return resp["hits"]["hits"]


def search_director(id_field, ids, size):
    resp = ES.search(
        index="movie",
        query={
            "bool": {
                "must": [
                    {"terms": {id_field: ids}},
                    {"match": {"credits.crew.job": "Director"}},
                ]
            }
        },
        sort=[{"popularity": {"order": "desc"}}],
        size=size,
    )
    return resp["hits"]["hits"]


@app.route("/autocomplete")
def search_autocomplete_suggestions():
    global ES
    query = request.args["search_query"]
    topic = request.args["search_by"]
    size = 3
    resp = ES.search(
        index="movie",
        query={
            "match": {
                topic: {
                    "query": query,
                    "operator": "AND",
                    "minimum_should_match": "-1",
                    "fuzziness": "AUTO:5,10",
                    "fuzzy_transpositions": "false",
                },
            },
        },
        sort=[{"popularity": {"order": "desc"}}],
        size=size,
    )
    if len(resp["hits"]["hits"]) == 0:
        # No hits? Try again with OR matching
        resp = ES.search(
            index="movie",
            query={
                "match": {
                    topic: {
                        "query": query,
                        "operator": "OR",
                        "minimum_should_match": "-1",
                        "fuzziness": "AUTO:5,10",
                        "fuzzy_transpositions": "false",
                    },
                },
            },
            sort=[{"popularity": {"order": "desc"}}],
            size=size,
        )
    return resp["hits"]["hits"]


@app.route("/get-recommendations")
def post_retrieve_recommendations_from_set():
    """
    Dig for recommendations based on set of 3 or more movie ID's
    """
    global ES
    # Retrieve list of movie ID's to start search from
    seed_set = request.args.getlist("seeds[]")
    seen_ids = {int(x) for x in seed_set}

    recommendations_to_return = []

    for movie_id in seed_set:
        # Get movie details from ID
        movie_details = ES.get(index="movie", id=movie_id)
        for rec_id in movie_details["_source"]["recommendations"]:
            if rec_id not in seen_ids:
                rec = ES.get(index="movie", id=rec_id)
                recommendations_to_return.append(rec.body)
                seen_ids.add(rec_id)

    return recommendations_to_return


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

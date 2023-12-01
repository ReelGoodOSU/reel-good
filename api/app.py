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
        return resp['_source'], 200
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
    resp = ES.get(index="person", id=id)
    return resp["_source"]


@app.route("/search")
def search_elastic():
    query = request.args.get("search_query")
    topic = request.args.get("search_by")
    size = request.args.get("size") or 25

    print(f"Backend Debug: search_query: {query}")
    print(f"Backend Debug: search_by: {topic}")

    if topic == "title":
        return search_movies_directly(topic, query, size)
    elif topic in ["production_company", "actor", "credits", "genres", "director"]:
        return search_movies_indirectly(topic, query, size)
    else:
        return search_movies_indirectly(topic, query, size)
        #pass

def search_movies_directly(topic, query, size):
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

    #fuzz search
    fuzz_fields=["overview", "keywords"]
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
                    "minimum_should_match": 2
                }
            }
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
    ids=[]
    # First search to get IDs if topic is production_company
    if 1 == 1: # this if can be safely deleted, but just in case we keep it here for easier indentation
        id_response = ES.search(
            index=index,
            query={
                "match": {
                    field: {
                        "query": query,
                        "operator": "OR"
                    }
                }
            }
        )
        ids = [hit["_id"] for hit in id_response["hits"]["hits"]]
        print(f"indirect_search-ids1: {ids}")
        
    # debug statements
    print(f"DEBUG:indirect_search-id_field: {id_field}")
    print(f"DEBUG:indirect_search-ids: {ids}")


    # Second search in movie index
    if topic == "director":
        return search_director(id_field,ids,size)

    resp = ES.search(
        index="movie",
        query={
            "terms": {
                id_field: ids 
            }
        },
        sort=[{"popularity": {"order": "desc"}}],
        size=size
    )
    return resp["hits"]["hits"]

def search_director(id_field,ids,size):
    resp = ES.search(
        index="movie",
        query={
            "bool": {
                "must":[
                    {
                        "terms": {
                            id_field: ids 
                        }
                    },{
                        "term":{
                        "credits.cre.job.keyword":"Director"
                        }
                    }
                ]
            }
        },
        sort=[{"popularity": {"order": "desc"}}],
        size=size
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


"""
For the backend this is what I need to know to handle a search query and returning the result

1. How is the data from the search form returned to flask? - At the moment I am assuming we use a GET request.
    We might need to use POST if too much data is being passed, or if we want to send JSON data
2. How do I determine the field I perform the query on (actor, genre, title, etc)?
3. How do I know the name of fields of data items?
4. How should I format the data to be returned?
"""


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

#!/usr/bin/env python3

from flask import Flask, request
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


# Demo on how to get info from the elasticsearch client
@app.route("/info")
def get_elastic_info():
    global ES
    return ES.info(pretty=True).body


# TEMP NOTE: WE WILL BE USING GET REQUEST FOR SEARCHING BECAUSE WE ARE NOT MODIFY DATA, WE ARE SEARCHING AND GETTING DATA BACK
@app.route("/search")
def search_elastic():
    global ES
    # TODO HOW SHOULD I FORMAT AND RETURN THE DATA
    request.args
    query = request.args.get('query')
    return ES.search(index="movies", query={"match": {"credits": {"query": query}}}).body


"""
For the backend this is what I need to know to handle a search query and returning the result

1. How is the data from the search form returned to flask?
2. How do I determine the field I perform the query on (actor, genre, title, etc)?
3. How do I know the name of fields of data items?
4. How should I format the data to be returned?
5.
"""


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

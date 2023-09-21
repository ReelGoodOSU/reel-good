#!/usr/bin/env python3

import random
from flask import Flask, jsonify
from elasticsearch import Elasticsearch
import time

# For testing purposes, we will want to change how this is stored in actual backend
ELASTIC_PASSWORD = "cse5914_capstone"

elastic_client = Elasticsearch(
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
    global elastic_client
    return elastic_client.info(pretty=True).body


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

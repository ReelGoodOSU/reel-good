#!/usr/bin/env python3

from argparse import ArgumentParser
from elasticsearch import Elasticsearch, helpers
import elastic_transport

import json
import re
import tarfile


def generate_actions(fname: str):
    index_loc = re.compile("^[a-zA-Z_]*[a-zA-Z]")
    # Open the tarfile, no need to have the user extract it
    with tarfile.open(fname) as tar_file:
        # For each file in the archive, ingest all data into the ES instance
        file = tar_file.next()
        print("Starting with", file.name)
        while file:
            # Get a IO file representation of the file to work with
            data_file = tar_file.extractfile(file)
            # Name of the index is provided by the name of the file
            index_name = index_loc.match(file.name).group()

            # For each line in the file, modify as needed and return from interator
            for line in data_file:
                data = json.loads(line)
                if index_name == "movie" and not data["release_date"]:
                    data["release_date"] = None
                yield {
                    "_op_type": "create",
                    "_index": index_name,
                    "_id": data["id"],
                    **data,
                }
            print(f"Finished ingesting data into {index_name} index")
            data_file.close()
            file = tar_file.next()


def parse_args():
    """Parse the command line arguments and return a namespace with the arguments"""
    parser = ArgumentParser(
        prog="Elasticsearch Data Ingester",
    )
    parser.add_argument(
        "tar_file",
        help="Name of the tar file holding all the files that need to be indexed into the Elasticsearch instance",
    )
    parser.add_argument(
        "--es_url",
        help="URL of the Elasticsearch instance to connect to",
        default="https://es01:9200",
    )
    parser.add_argument(
        "--ca_crt_loc",
        help="Location ofthe ca.crt used to connect to the Elasticsearch instance",
        default="/app/certs/ca/ca.crt",
    )
    parser.add_argument(
        "--user",
        help="Username for signing into the Elasticsearch instance",
        default="elastic",
    )
    parser.add_argument(
        "--password",
        help="Password for signing into the Elasticsearch instance",
        default="cse5914_capstone",
    )
    return parser.parse_args()


def main(args):
    client = Elasticsearch(
        args.es_url,
        ca_certs=args.ca_crt_loc,
        basic_auth=(args.user, args.password),
        request_timeout=None
    )

    try:
        for result in helpers.streaming_bulk(
            client, actions=generate_actions(args.tar_file), raise_on_error=False
        ):
            if not result[0]:
                with open("errors.log", "a") as err_out:
                    err_out.write(json.dumps(result[1]))
                    err_out.write("\n")
                print("ERROR: ")
                error = result[1]["create"]["error"]
                print(json.dumps(error, indent=4))
                print()
    except elastic_transport.ConnectionTimeout as e:
        print(e)



if __name__ == "__main__":
    main(parse_args())

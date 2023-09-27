import requests

# Arrange
host = "http://localhost:3000"
endpoint = "/search"


def test_search_200_title_exact_match():
    params = {
        "search_query": "Harry Potter and the Prisoner of Azkaban",
        "search_by": "title",
    }
    response = requests.get(url=f"{host}{endpoint}", params=params)
    assert response.status_code == 200
    assert (
        response.json()[0]["_source"]["title"]
        == "Harry Potter and the Prisoner of Azkaban"
    )


def test_search_200_title_no_results():
    params = {
        "search_query": "asdfasdf",
        "search_by": "title",
    }
    response = requests.get(url=f"{host}{endpoint}", params=params)
    assert response.status_code == 200
    assert len(response.json()) == 0

import requests

# Arrange
host = "http://localhost:3000"
endpoint = "/info"


def test_get_elastic_info_200():
    # Act
    response = requests.get(url=f"{host}{endpoint}")

    # Assert
    assert response.status_code == 200
    assert "cluster_name" in response.json()
    assert response.json()["cluster_name"] == "reel-good-default"

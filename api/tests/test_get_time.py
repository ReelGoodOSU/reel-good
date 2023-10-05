import pytest
import time


def test_get_time_200(flask_test_client):
    # Act
    response = flask_test_client.get("/time")
    data = response.get_json()

    # Assert
    assert response.status_code == 200
    assert "time" in data
    assert data["time"] == pytest.approx(time.time(), abs=1)

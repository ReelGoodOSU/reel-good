import pytest
from api.app import app


@pytest.fixture
def flask_test_client():
    with app.test_client() as client:
        yield client

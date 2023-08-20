import pytest
from httpx import AsyncClient

from server import app      # importing FastAPI app


@pytest.mark.anyio
async def test_api_db_call():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get('/')
    
    assert response.status_code == 200
    assert response.json() == 'some db data'

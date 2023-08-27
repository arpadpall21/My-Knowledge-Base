#################################################################
#################################################################
# async testing (this required to install trio lib)
#################################################################
import asyncio
from fastapi import FastAPI


app = FastAPI()


async def fake_db_call():
    await asyncio.sleep(2)        # simulating latency
    return 'some db data'


@app.get('/')
async def root():
    data = await fake_db_call()
    return data


# import pytest
# from httpx import AsyncClient


# @pytest.mark.asyncio
# async def test_api_db_call():
#     async with AsyncClient(app=app, base_url="http://test") as client:
#         response = await client.get('/')
    
#     assert response.status_code == 200
#     assert response.json() == 'some db data'

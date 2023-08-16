#################################################################
# simplest server
#################################################################
# from fastapi import FastAPI

# app = FastAPI()


# @app.get('/')
# def read_root():
#     return "Hello World!"


#################################################################
# http methods / path parameter / query string processing
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()


# item_list = ['one', 'two', 'three']


# class PutBody(BaseModel):           # pydantic models do data validations on request
#     item: str


# class PostBody(BaseModel):
#     items: List[str]


# @app.get('/item/{item_idx}')
# def read_item(item_idx: int):       # parameter type described here (this is how type validation is made)
#     if len(item_list) < item_idx + 1 or item_idx < 0:
#         return 'No such item exits'
#     return item_list[item_idx]


# @app.get('/items')
# def read_all_items(limit: int = -1):    # limit is a query string key in this case (no url parameter references it)
#     if limit < 0 or limit > len(item_list):
#         return item_list
#     return item_list[:limit]


# @app.post('/items')
# def update_items(body: PostBody):
#     for item in body.items:
#         item_list.append(item)
#     return 'Items are added to the item list'


# @app.put('/item')
# def add_item(body: PutBody):
#     item_list.append(body.item)
#     return 'Added to item list'


# @app.delete('/item/{item_idx}')
# def delete_item(item_idx: int):
#     if len(item_list) < item_idx + 1 or item_idx < 0:
#         return 'No such item exits'
#     deleted_item = item_list.pop(item_idx)
#     return f'Item successfully deleted: {deleted_item}'



#################################################################
# route declaration order matters
#################################################################
# from fastapi import FastAPI

# app = FastAPI()


# @app.get('/hello/world')        # wouldn't be reachable if it was declared after the below route (because <mark>/hello/{person}</mark> shadow this route)
# def read_hello_world():
#     return 'Hello World!'


# @app.get('/hello/{person}')
# def read_hello_param(person: str):
#     return f'Hello {person}'



#################################################################
# predefined path parameters
#################################################################
# from enum import Enum

# from fastapi import FastAPI

# app = FastAPI()


# class Car(str, Enum):
#     audi = 'Audi'
#     bmw = 'Bmw'
#     mercedess = 'Mercedess'


# @app.get('/car_info/{car}')             # the 'car' parameter can be one of the 3 enum values only
# async def read_hello_world(car: Car):
#     return {'mark': car, 'info': 'some info'}



#################################################################
# using path parameter to match any following paths
#################################################################
# from fastapi import FastAPI

# app = FastAPI()


# @app.get('/{all_paths:path}')       # (matches any paths) the <mark>:path</mark> post fix allows the path parameter to match any of the following paths
# async def get_all_paths():
#     return 'Any path!'



#################################################################
# query string parsing
#################################################################
# from fastapi import FastAPI

# app = FastAPI()


# items = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']


# @app.get('/items')
# async def get_items(limit: int, skip: int = 0):     # query parameter <mark>limit</mark> is required (has no default value), <mark>skip</mark> is optional (has default value)
#     return items[skip:limit]

# URL 
# # http://localhost:3000/items?skip=1&limit=6 
# response
# # ["two", "three", "four", "five", "six,]



#################################################################
# request body validation
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()


# class Item(BaseModel):
#     name: str
#     price: float
#     origin: str | None = None    # optional field


# class PostBody(BaseModel):
#     items: List[Item]           # -! <mark>[Item]</mark> won't work


# # the post body must be:
# # {"items": [
# #   {"name": "someName", "price": 1.1},
# #   ...
# #   ]
# # }
# @app.post('/items')
# def post_items(body: PostBody):
#     print(body.dict())          # pydantic method convert incomming body into dictionary
#     return 'Ok'



#################################################################
# using path parameter, query parameter and body at the same time
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# api = FastAPI()


# class Person(BaseModel):
#     name: str
#     surname: str
#     age: int


# @app.post('/person/{id}')
# def post_person(id: int, person: Person, parse_capital: bool = False):      # <mark>id</mark>               <- path parameter (because it is in the URL)
#     pass                                                                    # <mark>person</mark>           <- request body (because it is pydantic model)
#                                                                             # <mark>parse_capital</mark>    <- query parameter (because it is not present in the URL nor a pydantic model)



#################################################################
# query parameter validation
#################################################################
# from fastapi import FastAPI, Query
# from pydantic import BaseModel
# from typing import Annotated


# app = FastAPI()

# items = [1, 2, 3, 4, 5, 6, 7, 8, 9]

# # # for python 3.10+
# # @app.get('/items')
# # def get_items(limit: Annotated[int | None, Query(min=2, max=5)] = 3):     # <mark>limit</mark> query string is validated agains <mark>Query()</mark> conditions 
# #     return items[:limit]


# # # for python 3.6+
# # from typing import Union
# # from typing_extensions import Annotated


# # @app.get('/items')
# # def get_items(limit: Annotated[Union[int, None], Query(min=2, max=5)] = 3):
# #     return items[:limit]


# # using regex (not te best example on earth :/)
# @app.get('/items')
# def get_items(limit: Annotated[str | None, Query(title='limit as word', pattern='(two|three|four|five)')] = 'two'):
#     _limit = 0
#     match limit:
#         case 'two':
#             _limit = 2
#         case 'three':
#             _limit = 3
#         case 'four':
#             _limit = 4
#         case 'five':
#             _limit = 5
    
#     return items[:_limit]



#################################################################
# path parameter validation
#################################################################
# from fastapi import FastAPI, Path
# from typing import Annotated


# app = FastAPI()

# person = [
#     {'id': 1, 'name': 'Arpad', 'surname': 'Pall'},
#     {'id': 2, 'name': 'Peter', 'surname': 'Owen'},
#     {'id': 3, 'name': 'Anna', 'surname': 'Freshkin'},
# ]


# @app.get('/person/{id}')
# def get_person(id: Annotated[int, Path(title='Person id', ge=1, le=3)]):    # path parameter must be an integer between 1 (included) and 3 (included)
#     return next(filter(lambda e: e['id'] == id, person))



#################################################################
# using 2 pydantic models as body
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# app = FastAPI()


# class Person(BaseModel):
#     name: str
#     surname: str


# class Item(BaseModel):
#     name: str
#     price: float


# # expects a body:
# # {
# #     'person': {
# #         'name': 'some_name',
# #         'surname': 'some_surname',
# #     },
# #     'item': {
# #         'name': 'some_item_name',
# #         'price': 1.99,
# #     }
# # }
# @app.post('/')
# def post_root(person: Person, item: Item):
#     return {
#         'person': person.dict(),
#         'item': item.dict(),
#     }



#################################################################
# pydantic field validation
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel, Field, HttpUrl


# app = FastAPI()


# class Job(BaseModel):
#     title: str = Field(title='Job title', default=None, maxlength=90)       # field validation
#     payrange: float = Field(description='payrange', gt=1500, le=3500)
#     tax: float | None = None          # optional field
#     url: HttpUrl


# @app.post('/')
# def post_root(job: Job):
#     return job



#################################################################
# request body as Array
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel, HttpUrl


# app = FastAPI()


# class Image(BaseModel):
#     name: str
#     url: HttpUrl


# @app.post('/images')
# def post_images(*, images: list[Image]):   # expects the request body to be an array
#     return images



#################################################################
# extra data types 
#################################################################
# import uuid
# import datetime

# from fastapi import FastAPI
# from pydantic import BaseModel, HttpUrl


# app = FastAPI()


# class RequestBody(BaseModel):
#     id: uuid.UUID
#     date: datetime.date
#     url: HttpUrl


# @app.post('/')
# def post_body(body: RequestBody):
#     return body



#################################################################
# cookie & header validation
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, Cookie, Header


# app = FastAPI()


# @app.get("/items/")
# async def read_items(
#         some_cookie: Annotated[str, Cookie(max_length=5)],       # request must have a cookie named 'some_cookie' its value will be validated against <mark>Cookie()</mark>
#         custom_header: Annotated[str, Header(pattern="^s.*e$")]):     # request must have 'custom_header' header and its value must be validated against 'Header()'
#     return 'OK'                                                       # (header will be 'custom-header')



#################################################################
# return type annotaion 
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# app = FastAPI()


# class Item(BaseModel):
#     name: str
#     price: float
#     available: bool = False      # default 


# # annotation in decorator
# @app.get('/', response_model=Item)
# # @app.get('/', response_model=None)        # disable response type modeling
# def get_root():
#     return Item(name='potatoe', price=3.22, available=True)


# # annotation as return type 
# @app.get('/item')
# def get_root() -> Item:
#     return Item(name='potatoe', price=3.22, available=True)



#################################################################
# redirecting
#################################################################
# from fastapi import FastAPI
# from fastapi.responses import RedirectResponse

# app = FastAPI()


# @app.get('/')
# def get_root() -> RedirectResponse:
#     return RedirectResponse(url="https://www.youtube.com/watch?v=dQw4w9WgXcQ")



#################################################################
# excluding fields
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# app = FastAPI()


# class Person(BaseModel):
#     name: str
#     surname: str
#     age: int | None = None
#     alive: bool = True


# @app.get('/person', response_model=Person, response_model_exclude_unset=True)
# def get_person():
#     return Person(name='Arpad', surname='Pall')

# requesting http://localhost:3000/person response:
# {
#     "name": "Arpad",              # pydantic fields with default values are omitted
#     "surname": "Pall"
# }



#################################################################
# icluding fields from a pydantic model
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# app = FastAPI()


# class Person(BaseModel):
#     name: str
#     surname: str
#     age: int | None = None
#     alive: bool = True


# @app.get('/person', response_model=Person, response_model_include={'name', 'surname', 'age'})
# def get_person():
#     return Person(name='Arpad', surname='Pall', age=38)



#################################################################
# pydantic model to dict / dict to pydantic model
#################################################################
# from pydantic import BaseModel


# class Person(BaseModel):
#     name: str
#     age: int
#     alive: bool = True

# # pydantic model
# person_pydantic_model = Person(name='Arpad', age=38)
# print(type(person_pydantic_model))      # -> <class '__main__.Person'>      # pydantic model

# # pydantic model to dict
# person_dict = person_pydantic_model.dict()
# print(person_dict)                  # -> {'name': 'Arpad', 'age': 38, 'alive': True} 

# # pydantic model to dict excluding default values
# person_dict = person_pydantic_model.dict(exclude_unset=True)        # unset values are excluded in the returned dictionary
# print(person_dict)                  # -> {'name': 'Arpad', 'age': 38} 

# # dict to pydantic model
# person = {'name': 'Arpad', 'age': 38, 'alive': True}
# person_pydantic_model = Person(**person)
# print(person_pydantic_model)        # -> Person(name='Arpad' age=38 alive=True)

# # pydantic model copy
# new_person_pydantic_model = person_pydantic_model.copy()    # creates a pydantic model copy
# print(new_person_pydantic_model)    # -> Person(name='Arpad' age=38 alive=True)

# new_person_pydantic_model_2 = person_pydantic_model.copy(update={'age': 23})    # update data while copy
# print(new_person_pydantic_model_2)  # -> Person(name='Arpad' age=23 alive=True)





#################################################################
# multiple response type annotation
#################################################################
# from fastapi import FastAPI
# from pydantic import BaseModel


# app = FastAPI()


# class Transport(BaseModel):
#     mark: str


# class Car(Transport):
#     engine_size: float


# class Plane(Transport):
#     wing_size: float


# @app.get('/transport')
# def get_transport() -> Car | Plane:         # docs will nicely show both (but Car is prioritized)
#     return Plane(mark='flyi', wing_size=3.4)



#################################################################
# status codes
#################################################################
# from fastapi import FastAPI
# from http import HTTPStatus


# app = FastAPI()


# @app.get('/', status_code=201)      # we can specify a response status code
# def get_root():
#     return 'OK'


# @app.get('/stuff', status_code=HTTPStatus.CREATED)
# def get_stuff():
#     return 'OK'


# @app.get('/{rest:path}', status_code=HTTPStatus.NOT_FOUND)
# def rest():
#     return ''



#################################################################
# conditional json response codes (however this way OpenApi docs doesn't document the response code)
#################################################################
# from fastapi import FastAPI, status
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel


# app = FastAPI()


# class RequestBody(BaseModel):
#     item: str


# items = ['one', 'two', 'three']


# @app.put('/new_item')
# def put_new_item(item: RequestBody):
#     if item in items:
#         return JSONResponse(status_code=status.HTTP_200_OK, content={'message': 'Item already exists!'})

#     items.append(item)
#     return JSONResponse(status_code=status.HTTP_201_CREATED, content={'message': 'Item added to the list!'})



#################################################################
# using Body
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, Body


# app = FastAPI()

# # expects a json request {"name": <name:str>, "age": <age:nr>}
# @app.post('/test')
# def put_new_item(name: Annotated[str, Body()], age: Annotated[int, Body()]):
#     return {'name': name, 'age': age}




#################################################################
# receiving form data 
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, Form


# app = FastAPI()


# @app.get('/form')
# def get_form(
#         username: Annotated[str, Form(max_length=120)],
#         password: Annotated[str, Form(pattern='^[\d\w]*$')]):
#     return {
#         'username': username,
#         'password': password,
#     }



#################################################################
# uploading files
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import HTMLResponse

# app = FastAPI()


# @app.post("/files/")
# async def create_files(files: Annotated[list[bytes], File()]):  # can receive multiple files (receives as bytes)
#     return {"file_sizes": [len(file) for file in files]}


# @app.post("/uploadfiles/")
# async def create_upload_files(
#     files: Annotated[
#         list[UploadFile], File(description="Multiple files as UploadFile")
#     ],
# ):
#     print(files[0].filename)
#     print(files[0].content_type)
#     return {"filenames": [file.filename for file in files]}


# @app.get("/")
# async def main():
#     content = """
# <body>
# <form action="/files/" enctype="multipart/form-data" method="post">
# <input name="files" type="file" multiple>
# <input type="submit">
# </form>
# <form action="/uploadfiles/" enctype="multipart/form-data" method="post">
# <input name="files" type="file" multiple>
# <input type="submit">
# </form>
# </body>
#     """
#     return HTMLResponse(content=content)



#################################################################
# raising http exeption
#################################################################
# from fastapi import FastAPI, HTTPException

# app = FastAPI()


# @app.get('/')
# def get_root():
#     raise HTTPException(
#         status_code=404,
#         detail='Not found',
#         headers={'X-Error': 'some error'})      # adding header in the response


# response will be 
# # {"detail": "Not found"}



#################################################################
# jsonable_encoder (jsonifying pydantic model)
#################################################################
# from datetime import datetime

# from fastapi.encoders import jsonable_encoder
# from pydantic import BaseModel


# class Person(BaseModel):
#     name: str
#     birth_date_time: datetime
#     job_title: str | None = None

# person = Person(name='Arpad', birth_date_time=datetime(1985, 4, 21, 12, 34))
# print(jsonable_encoder(person))     # -> {'name': 'Arpad', 'birth_date_time': '1985-04-21T12:34:00', 'job_title': None}

# print(jsonable_encoder(person.dict(exclude_unset=True)))        # -> {'name': 'Arpad', 'birth_date_time': '1985-04-21T12:34:00'}



#################################################################
# middleware
#################################################################
# from fastapi import FastAPI, Request


# app = FastAPI()


# # middleware will trigger for each path operation
# @app.middleware('http')
# async def add_custom_header(request: Request, call_next):
#     if request.url.path == '/':                     # this is how we can filter for which path we want to run the middleware logic
#     # we could do something before path functions receive the request
#         response = await call_next(request)
#         response.headers['X-Test'] = 'test'         # adding header path function finished their job
#     return response


# @app.get('/')
# @app.get('/test')
# def get_root():
#     return 'OK'



#################################################################
# router
#################################################################
# from fastapi import FastAPI, APIRouter


# app = FastAPI()

# test_router = APIRouter(prefix='/test')         # router prefixed with /test


# @test_router.get('/one')        # adding routes to th router (this will be <mark>/test/one</mark>)
# def get_test_one():
#     return 'Test-1 OK'


# @test_router.get('/two')
# def get_test_two():
#     return 'Test-2 OK'


# app.include_router(test_router)         # adding routher to the main route



#################################################################
# dependency injection
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, Depends


# app = FastAPI()


# async def query_string_params(skip: int | None = None, limit: int | None = None):
#     return {'skip': skip, 'limit': limit}


# items = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']


# @app.get('/items')
# def get_items(query_params: Annotated[dict, Depends(query_string_params)]):         # we can reuse the injected dependency
#     return items[query_params['skip']:query_params['limit']]


# @app.get('/items2')
# def get_items(query_params: Annotated[dict, Depends(query_string_params)]):
#     return items[query_params['skip']:query_params['limit']]



#################################################################
# background task
#################################################################
# import time

# from fastapi import FastAPI, BackgroundTasks


# app = FastAPI()


# def some_backgroundtask(delay: int):        # also supports async functio
#     print('background task started...')
#     time.sleep(delay)
#     print('background task end')


# @app.get('/')
# def get_root(background_tasks: BackgroundTasks, delay: int = 3):
#     background_tasks.add_task(some_backgroundtask, delay)       # triggering background task (this won't block the response)
#     return 'OK'



#################################################################
# serving static files
#################################################################
# from fastapi import FastAPI
# from fastapi.staticfiles import StaticFiles

# STATIC_DIR = '/Users/apall/Documents/Personal/my_knowledge_code_base/My Site'


# app = FastAPI()

# app.mount('/', StaticFiles(directory=STATIC_DIR), name='My Site')



#################################################################
# testing
#################################################################
# from fastapi import FastAPI
# from fastapi.testclient import TestClient


# app = FastAPI()


# @app.get('/')
# async def get_root():
#     return {'Hello': 'World'}


# # test
# test_client = TestClient(app)


# def test_get_root():
#     response = test_client.get('/')
#     assert response.status_code == 200
#     assert response.json() == {'Hello': 'World'}



#################################################################
# extended testing
#################################################################
# from typing import Annotated

# from fastapi import FastAPI, Header
# from fastapi.testclient import TestClient
# from pydantic import BaseModel


# app = FastAPI()


# class Person(BaseModel):
#     name: str
#     age: int | None = None


# @app.post('/test', response_model=Person)
# async def get_root(
#         required_header: Annotated[str, Header(min_length=10, max_length=10)],
#         person: Person):
#     print(required_header)
#     return person


# # test
# test_client = TestClient(app)


# def test_api():
#     response = test_client.post(
#         '/test',
#         headers={
#             'required-header': 'ijskdjw13h',
#         },
#         json={
#             'name': 'Arpad',
#             'age': 38,
#         }
#     )

#     assert response.status_code == 200
#     assert response.json() == {
#         'name': 'Arpad',
#         'age': 38,
#     }



#################################################################
# returning Response (this is not documented by OpenAPI) (this can be documented along with JSONResponse)
#################################################################
# from fastapi import FastAPI, Response


# app = FastAPI()


# @app.get('/test_1')
# def get_test_1():
#     return Response(content='Hello World!', media_type='text/plain')


# @app.get('/test_2')
# def get_test_2():
#     data = """<?xml version="1.0"?>
#         <person>
#             <name>Arpad</name>
#             <age>38</age>
#         </person>
#         """
#     return Response(
#         status_code=201,                        # custom status code
#         headers={'test': 'test'},               # additional headers
#         content=data,
#         media_type='application/xml')



#################################################################
# HTMLResponse
#################################################################
# from fastapi import FastAPI, Response
# from fastapi.responses import HTMLResponse


# app = FastAPI()


# @app.get('/test_1', response_class=HTMLResponse)
# def get_test_1():
#     return """
#     <html>
#         <head>
#             <title>Hello World!</title>
#         </head>
#         <body>
#             <p>Hello World!</p>
#         </body>
#     </html>
#     """


# @app.get('/test_2')
# def get_test_3():
#     response = """
#     <html>
#         <head>
#             <title>Hello World!</title>
#         </head>
#         <body>
#             <p>Hello World!</p>
#         </body>
#     </html>
#     """
#     return HTMLResponse(content=response)               # in this case OpenAPI won't document that the response will be HTML



#################################################################
# PlainTextResponse
#################################################################
# from fastapi import FastAPI
# from fastapi.responses import PlainTextResponse


# app = FastAPI()


# @app.get('/test', response_class=PlainTextResponse)
# def get_test():
#     return 'Hello Wolrd!'



#################################################################
# StreamingResponse
#################################################################

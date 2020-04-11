# Performance Test (Python vs Javascript) 

I wanted to compare performance and memory consumption of frameworks and languages that I choose to develop backend servers. This repository contains minimal server setups for 4 frameworks with same code snippet. 

I'll keep on updating these benchmark results with different test I'll be performing. You can refer to [Changelog](CHANGELOG.md) section for updates.

---
## How comparison will be done ? 

All of these 4 server expose API endpoints execute a similar code snippet. We'll perform a load test on each of these API using [autocannon](https://github.com/mcollina/autocannon) and monitor performances of each framework based on the number of request it can serve with respect to variation in number of concurrent users. 

## Overview

We know that Javascript & Python are both single threaded and interpreted language. So when to choose what? 

Right, there already are a lot of references on internet, but I actually wanted to show you and let yourself decide what is best for your use case.

Many of us believe that Javascript & NodeJS is better than Python because of it's asynchronous nature. Well, that's a myth. It is somewhat true but not completely. 

Asynchronous nature of Javascript is provided by **event-loop**, which is provided to javascript by [libuv](http://docs.libuv.org/en/latest/) library. If somehow we're able to add similar **event-loop** to our python thread, will python be on par with javascript's performance? Answer is still NO. It's because of the underlying differences between their interpreters.

Javascript uses [V8](https://v8.dev/docs) as default interpreter which uses less memory to execute JS code than Python's interpreter. Core differences lie in how they manage memory & CPU during execution. 

There were asynchronous options available in Python Community using [asyncio](https://docs.python.org/3/library/asyncio.html#module-asyncio) but now there is another better and faster alternative to that known as [uvloop](https://uvloop.readthedocs.io/) which is provided by the same libuv library that power Javascript's event-loop.

Now difference remains at Interpreter level. You can still choose [pypy](https://www.pypy.org/), a better & faster alternative to default python interpreter.

We'll stick to the default Interpreters for both Javascript & Python.

---

## Frameworks

- [Django](https://www.djangoproject.com/) : Synchronous (Support for ASGI in progress) - Python
- [Fastapi](https://fastapi.tiangolo.com/) : Asynchronous (using uvloop) - Python
- [Express](http://expressjs.com/) : Asynchronous (NodeJS) - Javascript
- [Fastify](https://www.fastify.io/) : Asynchronous (NodeJS) - Javascript

---

## Setup

### Django or Fastapi Server

Change your directory `django_server` or `fastapi_server`

``` bash
$ cd django_server
```
or 
``` bash
$ cd fastapi_server
```
For each directory run following commands:

``` bash
$ python3 -m venv venv
```
``` bash
$ source venv/bin/activate
```
``` bash
$ pip install -r requirements.txt
```

**For django_server**
``` bash
$ python manage.py runserver
```

**For fastapi_server**
``` bash
$ python src/main.py
```
and kill the server using `ctrl+c`.

### Express or Fastify Server

Change your directory `express_server` or `fastify_server`

``` bash
$ cd express_server
```
or 
``` bash
$ cd fastify_server
```
For each directory run following commands:

``` bash
$ npm install
```

``` bash
$ node index.js
```

### Install autocannon

``` bash
$ npm i -g autocannon
```



## Test #1

**Running single process/worker of application to utilize only 1 CPU core for processing of any data**

[Screenshots](test/#1)

### Result

| Framework | Nature |    Logs Enabled    |  Users | Duration (sec) | Requests | Min Req/Sec | Avg Req/Sec | Avg Latency (ms) |
|:--------- |:------:|:------------------:|-------:|--------:|---------:|------------:|------------:|------------:|
| Django    |  sync  | :heavy_check_mark: |     10 |    10.08 |   ~ 4000 |         364 |         432 |       22.45 |
| Django    |  sync  | :heavy_check_mark: |    100 |    10.12 |   ~ 4000 |         379 |         425 |      230.04 |
| Fastapi   |  sync  | :heavy_check_mark: |     10 |    10.05 |  ~ 15000 |        1230 |        1497 |        6.18 |
| Fastapi   | async  | :heavy_check_mark: |     10 |    10.07 |  ~ 18000 |        1661 |        1807 |        4.97 |
| Fastapi   |  sync  | :heavy_check_mark: |    100 |    10.09 |  ~ 19000 |        1659 |        1865 |       53.05 |
| Fastapi   | async  | :heavy_check_mark: |    100 |    10.09 |  ~ 22000 |        1972 |        2216 |       44.56 |
| Fastapi   |  sync  | :heavy_check_mark: |    500 |    10.14 |  ~ 18000 |        1409 |        1793 |      276.15 |
| Fastapi   | async  | :heavy_check_mark: |    500 |    10.15 |  ~ 22000 |        1457 |        2201 |      226.42 |
| Expres    |  sync  | :heavy_check_mark: |     10 |    10.06 |  ~ 34000 |        3106 |        3422 |        2.44 |
| Expres    | async  | :heavy_check_mark: |     10 |    10.06 |  ~ 35000 |        3116 |        3458 |        2.42 |
| Expres    |  sync  | :heavy_check_mark: |    100 |    10.07 |  ~ 35000 |        2864 |        3491 |       28.14 |
| Expres    | async  | :heavy_check_mark: |    100 |    10.07 |  ~ 35000 |        2949 |        3505 |       28.02 |
| Fastify   |  sync  | :heavy_check_mark: |     10 |    10.06 |  ~ 41000 |        3272 |        4099 |        1.89 |
| Fastify   | async  | :heavy_check_mark: |     10 |    10.07 |  ~ 39000 |        3522 |        3944 |        1.99 |
| Fastify   |  sync  | :heavy_check_mark: |    100 |    10.01 |  ~ 40000 |        3117 |        4023 |       24.36 |
| Fastify   | async  | :heavy_check_mark: |    100 |    10.08 |  ~ 39000 |        2876 |        3878 |       25.28 |
| Express   | async  | :x:                |    100 |    11.08 |  ~ 58000 |        5105 |        5287 |       18.42 |
| Fastify   | async  | :x:                |    100 |    11.09 | ~ 104000 |        6676 |        9448 |       10.09 |

### Observation

- Django is really heavy & slow framework to develop small projects or microservices.
- Asynchronous code behave similar to synchronous code while performing CPU intensive tasks.
    - Each event loop process handles single core of CPU and a single core can process one CPU request at any time. 
    - In python there is noticable difference between sync and async execution. This has to do something with how Python interpreter allocate memory to async functions
- Lower you keep your API latency (*response time*), higher number of request you serve.
- For a particular api latency increases with increase in number of concurrent connection/users.
- Logging library plays an important role, but also it slow down request/response cycle of your application.
- Fastapi is one of the fastest python micro framework . 
- Javascript is really light weight as compared to Python.

### Conclusion
- Logging should always be done asynchronously or via streaming.
- Javascript is better than python in terms of CPU utilization or IO operation.

#### Use Javascript
-  When you want to handle heavy load on server. Some use cases:
    - Real time traffic
    - Heavy IO
    - CPU Intensive Task (Use child process, Don't block the event loop)

#### Use Python
- When you want to do any *Data Science* related tasks because python has great support for Data Science. Some use cases:
    - Data analytics
    - Machine learning
    - Math-intensive operations like predictions & Forecasting
    - Generating Graphs, Charts, PDF and other docs at server side.

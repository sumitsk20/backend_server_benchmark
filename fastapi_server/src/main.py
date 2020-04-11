from fastapi import FastAPI, Response
import math
import uvicorn
from fastapi.responses import ORJSONResponse


app = FastAPI()


def calculate_square() -> dict:
    result = {}
    i = 1
    while(i < 1000):
        result[str(i)] = str(math.pow(i, 2))
        i += 1
    return result


async def get_result() -> dict:
    return calculate_square()


@app.get("/result/sync")
def calculate_square_of_all_elemnts(response: Response):
    result = calculate_square()
    response.headers["Connection"] = "keep-alive"
    return ORJSONResponse(content={"data": result}, headers=response.headers)


@app.get("/result/async")
async def calculate_square_of_all_elemnts(response: Response):
    response.headers["Connection"] = "keep-alive"
    result = await get_result()
    return ORJSONResponse(content={"data": result}, headers=response.headers)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001,
                log_level="info", use_colors=False, loop="uvloop")

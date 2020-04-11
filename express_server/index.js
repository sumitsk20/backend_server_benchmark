const express = require('express')
const app = express()
var pino = require('express-pino-logger')()
app.use(pino)

const port = 8003

app.disable('etag')
app.disable('x-powered-by')

function calculate_square() {
    let result = {}
    for (let i = 1; i < 1000; i++) {
        result[String(i)] = String(Math.pow(i, 2))
    }
    return result
}

async function get_result() {
    return calculate_square()
}

app.get('/result/sync', (req, res) => {
    const result = calculate_square()
    res.send({ "data": result })
})

app.get('/result/async', async (req, res) => {
    const result = await get_result()
    res.send({ "data": result })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
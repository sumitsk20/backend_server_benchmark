const fastify = require('fastify')({
    logger: true
})
const port = 8004;


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

fastify.get('/result/sync', (request, reply) => {
    const result = calculate_square()
    reply.send({ "data": result })
})

fastify.get('/result/async', async (request, reply) => {
    const result = await get_result()
    reply.send({ "data": result })
})


const start = async () => {
    try {
        await fastify.listen(port)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
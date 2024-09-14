require('dotenv').config();
const Fastify = require('fastify');
const axios = require('axios');
const fastify = Fastify({ logger: true });


fastify.get('/odsay/dirs', async(request, reply) => {
    const { SX, SY, EX, EY } = request.query;

    const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${SX}&SY=${SY}&EX=${EX}&EY=${EY}&apiKey=${process.env.ODSAY_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
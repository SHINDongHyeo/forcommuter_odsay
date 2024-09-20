require('dotenv').config();
const Fastify = require('fastify');
const axios = require('axios');
const fastify = Fastify({ logger: true });

// 경로 검색 + 실시간 버스 도착정보 조회
fastify.get('/odsay/dirs', async(request, reply) => {
    const { SX, SY, EX, EY } = request.query;
    const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${SX}&SY=${SY}&EX=${EX}&EY=${EY}&apiKey=${process.env.ODSAY_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        fastify.log.error(error);
        reply.status(error.status).send({ error });
    }
});

// 실시간 버스 도착정보 조회
fastify.get('/odsay/bus/realtime', async(request, reply) => {
    const { stationID, routeIDs } = request.query;
    let url;
    if (routeIDs){
        url = `https://api.odsay.com/v1/api/realtimeStation?stationID=${stationID}&routeIDs=${routeIDs}&apiKey=${process.env.ODSAY_API_KEY}`;
    }else {
        url = `https://api.odsay.com/v1/api/realtimeStation?stationID=${stationID}&apiKey=${process.env.ODSAY_API_KEY}`;
    }
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        fastify.log.error(error);
        reply.status(error.status).send({ error });
    }
});

// 노선 그래픽 데이터 검색
fastify.get('/odsay/loadlane', async(request, reply) => {
    const { mapObj } = request.query;
    let mapObjList;
    if (mapObj.includes('@')) {
        mapObjList = mapObj.split('@');
    } else {
        mapObjList = [mapObj];
    }

    try {
        const responseDataList = await Promise.all(
            mapObjList.map(async (mapObjItem) => {
                const url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObjItem}&apiKey=${process.env.ODSAY_API_KEY}`;
                const response = await axios.get(url);
                return response.data;
            })
        );

        return responseDataList;
    } catch (error) {
        fastify.log.error(error);
        return reply.status(error.response ? error.response.status : 500).send({ error });
    }
});

fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
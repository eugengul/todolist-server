'use strict';

import express from 'express';

const server = express();

server.use(express.static('client'));

server.use(express.json());

const init = () => {
    server.listen(80, err => {
        if (err) console.warn(err);
        else console.log('Server läuft');
    })
}

init();
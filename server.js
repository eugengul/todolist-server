'use strict';

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import auth from './auth.js';
import sync from './sync.js';

const server = express();

server.use(express.static('client'));
server.use(express.json());
server.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
server.use(passport.session());

server.use('/auth', auth.authRouter);
server.post("/sync",
    passport.authenticate("jwt", { session: false }),
    sync.syncTasks);

const init = () => {
    server.listen(80, err => {
        if (err) console.warn(err);
        else console.log('Server läuft');
    })
}

init();
'use strict';

import express from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import jwt from "jsonwebtoken";

import db from './db.js'
import settings from './settings.js'

const authRouter = express.Router();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: settings.SECRET_AUTH_KEY,
};

passport.use(
    new Strategy(opts, (jwt_payload, next) => {
        db.User.findById(jwt_payload.id).then(
            user => { if (user) return next(null, user); }
        ).catch(next);
    })
);

const generateToken = (user) => {
    // generate access token
    const accessToken = jwt.sign(
        {
            id: user._id,
        },
        settings.SECRET_AUTH_KEY,
        { expiresIn: "1d" }
    )
    return accessToken
}

authRouter.post("/signup", (request, response, next) => {
    const username = request.body['username'];
    const password = request.body['password'];

    if (!username || !password)
        return response.status(400).json(
            { message: "Füllen Sie alle Felder aus." });

    // Check if a user already exist
    db.User.findOne({ username: username })
        .then(user => {
            if (!user) {
                // Create a new user if it does not exist
                db.User.create(request.body).then(
                    (user) => response.send(
                        {
                            accessToken: generateToken(user),
                            user: user,
                        }
                    )
                )
            } else {
                // If the user exists, send an error message.
                return response.status(400).json(
                    { message: "Der Benutzer existiert bereits." });
            }
        }).catch((err) => {
            console.warn(err);
            return next(err, false);
        }
        );

})

authRouter.post("/login", (request, response, next) => {
    const username = request.body.username;
    const password = request.body.password;

    db.User.findOne({ username: username}).then(
        (user) => {
            if (!user || user.password !== password)
                return response.status(400).json(
                    { message: "Ungültiger Benutzername oder Passwort." });
            else {
                // Successful login
                // Generate and return JWT Token
                const accessToken = generateToken(user);
                return response.json(
                    {
                        message: "user logged in",
                        accessToken: accessToken,
                        user: user
                    });
            }
        }).catch((err) => {
            console.warn(err);
            next(err);
        })
});

authRouter.get(
    "/user",
    passport.authenticate("jwt", { session: false }),
    (request, response) => {
        return response.send(JSON.stringify({ user: request.user }));
    })

const auth = {
    authRouter
}

export default auth;
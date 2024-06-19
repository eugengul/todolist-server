'use strict';

import dotenv from 'dotenv';

dotenv.config();

const SECRET_AUTH_KEY = process.env.SECRET_AUTH_KEY

if (!SECRET_AUTH_KEY) {
    throw new Error('You should set "SECRET_AUTH_KEY" in the file ".env"!');
}

const settings = {
    DB_URI: process.env.DB_URI || "mongodb://127.0.0.1:27017/todolist",
    SECRET_AUTH_KEY: SECRET_AUTH_KEY,
}

export default settings;
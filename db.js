'use strict';

import mongoose from 'mongoose';
import settings from './settings.js';

const Schema = mongoose.Schema;
const mongoDb = settings.DB_URI;

mongoose.connect(mongoDb);
const dbConnection = mongoose.connection;
dbConnection.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
    "User",
    new Schema({
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true }
    })
);

const db = {
    User,
}

export default db;
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
        password: { type: String, required: true },
        tasks: [
            { type: Schema.Types.ObjectId, ref: 'Task' }
        ]
    })
);

const TaskSchema = new Schema({
    name: { type: String },
    priority: { type: Number },
    dueDate: { type: Date },
    created: { type: Number },
    completed: { type: Boolean },
    deleted: {type: Boolean},
    lastUpdated: {type: Number },
});

const Task = mongoose.model("Task", TaskSchema);

const db = {
    User,
    Task,
}

export default db;
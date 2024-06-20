'use strict';

import { request } from 'express';
import db from './db.js';

const createTask = async (user, task) => {
    if (!task.deleted)
        return db.Task.create(task)
            .then(taskInDB => user.tasks.push(taskInDB));
}

const updateOrDeleteTask = async (user, task) => {
    // Check that the task belongs to this user.
    if (!user.tasks.includes(task._id)) {
        return null;
    } else if (task.deleted) {
        // Deletion has higher priority than update.
        return db.Task.findByIdAndDelete(task._id).then(
            () => user.tasks.pull(task._id));
    } else {
        // Find the task in the DB and update if necessary
        let taskInDB = await db.Task.findById(task._id)
        if (taskInDB && task.lastUpdated > taskInDB.lastUpdated) {
            return taskInDB.overwrite(task).save();
        } else
            return null;
    }
}

const saveTasks = (user, tasks) => {
    return Promise.all(tasks.map(task => {
        // If task has no id add it to DB
        if (!task._id) {
            return createTask(user, task);
        } else
            return updateOrDeleteTask(user, task);
    })).then(results => user.save());
};

const syncTasks = (request, response, next) => {
    const tasks = request.body.tasks;
    saveTasks(request.user, tasks)
        .then(() => {
            return request.user.populate('tasks').then(
                user => response.json({ tasks: user.tasks }))
        }).catch((err) => {
            console.warn(err);
            next(err);
        });
}

const sync = {
    syncTasks,
}

export default sync;
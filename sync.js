'use strict';

import { request } from 'express';
import db from './db.js';

const saveTasks = (user, tasks) => {
    return Promise.all(tasks.map(task => {
        // If task has id check that it belongs to this user
        if (task._id && user.tasks.includes(task._id)) {
            // And try to find this task in DB
            return db.Task.findById(task._id)
                .then(taskInDB => {
                    // Save the version with the later `lastUpdated` field
                    if (taskInDB && task.lastUpdated > taskInDB.lastUpdated) {
                        return taskInDB.overwrite(task).save();
                    } else
                        return null;
                })
        } else {
            // if task has no id add it to DB
            return db.Task.create(task)
            .then(taskInDB => {
                user.tasks.push(taskInDB)
            });
        }

    })).then(results => {
        return user.save();
    });
};

const syncTasks = (request, response, next) => {
    const tasks = request.body.tasks;
    saveTasks(request.user, tasks).then(() => {
        return request.user.populate('tasks').then(
            user => {
                response.json(
                    {
                        tasks: user.tasks,
                    })
            }
        )
    }).catch((err) => {
        console.warn(err);
        next(err);
    });
}

const sync = {
    syncTasks,
}

export default sync;
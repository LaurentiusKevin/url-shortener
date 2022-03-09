const db = require('../models')
const {Model} = require("sequelize");
const password = require('../utils/password')
const moment = require('moment')
const {validationResult} = require("express-validator");

class Users extends Model {
}

const list = (request, response) => {
    let data = db.Users.findAll()

    response.status(200).send({
        status: 'success',
        data: data
    })
}

const add = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let body = request.body

    let hashedPassword = password.hash(body.password)

    let data = {
        username: body.username,
        password: hashedPassword,
        name: body.name
    };

    let user = await db.Users.create(data)

    delete data.password

    response.status(200).send({
        status: 'success',
        data: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    })
}

const edit = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let query = request.query

    let toUpdate = {}
    if (query.username !== undefined) toUpdate.username = query.username
    if (query.password !== undefined) toUpdate.password = password.hash(query.password)
    if (query.name !== undefined) toUpdate.name = query.name

    db.Users.update(toUpdate, {
        where: {
            id: query.id
        }
    }).then(data => {
        delete toUpdate.password
        response.status(200).send({
            status: 'success',
            data: toUpdate
        })
    })
}

const deleteData = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let timestamp = moment.now()
    let query = request.query

    db.Users
        .update({deletedAt: timestamp}, {
            where: {
                id: query.id
            }
        })
        .then(data => {
            response.status(200)
                .send({
                    status: 'success',
                    data: data
                })
        })
}

// todo: Permanent Delete Process for user
const deleteDataPermanent = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let query = request.query

    db.Users
        .destroy({
            where: {
                id: query.id
            }
        })
        .then(data => {
            response.status(200).send({
                status: 'success',
                data: data
            })
        })
}

module.exports = {
    list,
    add,
    edit,
    deleteData,
    deleteDataPermanent
}
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

const add = (request, response) => {
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

    db.Users.create(data)

    delete data.password

    response.status(200).send({
        status: 'success',
        data: data
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

    db.Users.update(toUpdate,{
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

// todo: Delete Process for user
const deleteData = (request, response) => {

}

// todo: Permanent Delete Process for user
const deleteDataForce = (request, response) => {

}

module.exports = {
    list,
    add,
    edit,
    deleteData,
    deleteDataForce
}
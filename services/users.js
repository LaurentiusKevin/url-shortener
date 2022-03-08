const db = require('../models')
const {Model} = require("sequelize");
const password = require('../utils/password')
const moment = require('moment')

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
    let timestamp = moment.now()
    let body = request.body

    db.Users.findAll({
        where: {
            username: body.username
        }
    }).then(data => {
        if (data.length > 0) {
            response.status(200).send({
                status: 'failed',
                message: 'username has been used.',
            })
        } else {
            let hashedPassword = password.hash(body.password)

            let data = {
                username: body.username,
                password: hashedPassword,
                name: body.name,
                createdAt: timestamp,
                updatedAt: timestamp,
            };

            db.Users.create(data)

            delete data.password
            response.status(200).send({
                status: 'success',
                data: data
            })
        }
    })
}

const edit = (request, response) => {

}

const deleteData = (request, response) => {

}

const deleteDataForce = (request, response) => {

}

module.exports = {
    list,
    add,
    edit,
    deleteData,
    deleteDataForce
}
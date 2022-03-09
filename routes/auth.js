const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../models')
const password = require('../utils/password')

router.post('/login', function (request, response) {
    db.Users
        .findOne({
            where: {
                username: request.body.username
            }
        })
        .then(data => {
            if (data === null) {
                return response.status(401)
                    .send({
                        status: 'failed',
                        message: 'Incorrect username or password.'
                    })
            }
            if (password.check(data.password,request.body.password) === true) {
                let token = jwt.sign({
                    user_id: data.id,
                    username: data.username,
                    name: data.name
                }, password.secret, {expiresIn: '1h'})

                response.status(200).send({
                    status: 'success',
                    data: {
                        id: data.id,
                        username: data.username,
                        name: data.name,
                        token: token
                    }
                })
            } else {
                return response.status(401)
                    .send({
                        status: 'failed',
                        message: 'Incorrect username or password.'
                    })
            }
        })
        .catch((error) => response.status(400).send(error));
})

module.exports = router
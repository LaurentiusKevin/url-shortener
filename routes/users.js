const express = require('express')
const router = express.Router()
const {body, validationResult, query} = require('express-validator')
const db = require('../models')

const userService = require('../services/users')

router.get('/', userService.list)

router.post('/',
    body('username').not().isEmpty().withMessage('username required.')
        .custom(value => {
            return db.Users.findOne({where: {username: value}})
                .then(data => {
                    if (data) {
                        throw ('username exists.')
                    }
                })
        }).withMessage('username exists.'),
    body('password').not().isEmpty().withMessage('password required.'),
    body('name').not().isEmpty().withMessage('name required.'),
    userService.add)

router.put('/',
    query('id').not().isEmpty().withMessage('id required'),
    query('username').not().isEmpty().withMessage('username required.')
        .custom(value => {
            return db.Users.findOne({where: {username: value}})
                .then(data => {
                    if (data) {
                        throw ('username exists.')
                    }
                })
        }).withMessage('username exists.'),
    userService.edit)

router.delete('/',
    query('id').not().isEmpty().withMessage('id required.'),
    userService.deleteData)

module.exports = router

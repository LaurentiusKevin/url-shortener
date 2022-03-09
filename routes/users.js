const express = require('express')
const router = express.Router()
const {body, query} = require('express-validator')
const db = require('../models')
const auth = require('../middleware/auth')

const userService = require('../services/users')

router.get('/', userService.list)

router.post('/', auth,
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

router.put('/', auth,
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

router.delete('/', auth,
    query('id').not().isEmpty().withMessage('id required.'),
    userService.deleteData)

router.delete('/permanent', auth,
    query('id').not().isEmpty().withMessage('id required.'),
    userService.deleteDataPermanent)

module.exports = router

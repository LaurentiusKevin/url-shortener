const express = require('express')
const router = express.Router()
const models = require('../models')

const userService = require('../services/users')

/* GET users listing. */
router.get('/', userService.list)
router.post('/', userService.add)

module.exports = router

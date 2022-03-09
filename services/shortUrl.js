const db = require('../models')
const {Model, Op} = require('sequelize')
const moment = require('moment')
const {validationResult} = require("express-validator");

class ShortUrl extends Model {
}

const list = (request, response) => {
    db.ShortUrl.findAll()
        .then(data => {
            response.status(200).send({
                status: 'success',
                data: data
            })
        })
}

const add = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let timestamp = moment.now()
    let body = request.body

    db.ShortUrl.findAll({
        where: {
            short_url: body.short_url
        }
    }).then(data => {
        if (data.length > 0) {
            response.status(406).send({
                status: 'failed',
                message: 'short_url not available'
            })
        } else {
            let createData = {
                name: body.name,
                short_url: body.short_url,
                original_url: body.original_url,
                createdAt: timestamp,
                updatedAt: timestamp
            }

            if (body.expired_at !== undefined) {
                createData.expiredAt = body.expired_at
            }

            db.ShortUrl.create(createData)

            response.status(200).send({
                status: 'success',
                data: createData
            })
        }
    })
}

const edit = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    let query = request.query

    let toUpdate = {};
    if (query.name !== undefined) toUpdate.name = query.name
    if (query.short_url !== undefined) toUpdate.short_url = query.short_url
    if (query.original_url !== undefined) toUpdate.original_url = query.original_url
    if (query.expiredAt !== undefined) toUpdate.expiredAt = query.expiredAt

    db.ShortUrl.update(toUpdate, {
        where: {
            id: query.id
        }
    }).then(data => {
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

    let query = request.query

    db.ShortUrl.update({deletedAt: moment.now()}, {
        where: {
            id: query.id
        }
    }).then(data => {
        response.status(200).send({
            status: 'success',
            data: data
        })
    })
}

/**
 * flow: This part use the shortened url and then redirect to original url, or send message if deleted or expired
 * @param request
 * @param response
 */
const goToUrl = (request, response) => {
    let shortUrl = request.originalUrl.replace('/s_', '')

    let now = moment.now()

    db.ShortUrl.findOne({
        where: {
            short_url: shortUrl,
            deletedAt: null,
            [Op.or]: [
                {expiredAt: null},
                {
                    expiredAt: {
                        [Op.gt]: now
                    }
                }
            ]
        }
    }).then(data => {
        if (data === null) {
            response.status(406).send({
                status: 'failed',
                message: 'Short URL not found!'
            })
        } else {
            let url;
            try {
                url = new URL(data.original_url)
            } catch (e) {
                url = false
            }

            if (url !== false) {
                response.redirect(data.original_url)
            } else {
                response.redirect(`http://${data.original_url}`)
            }
        }
    })
}

module.exports = {
    list,
    add,
    edit,
    deleteData,
    goToUrl
}
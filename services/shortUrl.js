const db = require('../models')
const {Model} = require('sequelize')
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

// todo: Edit process for ShortUrl
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

    db.ShortUrl.update(toUpdate,{
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

// todo: Delete process for ShortUrl
const deleteData = (request, response) => {

}

/**
 * flow: This part use the shortened url and then redirect to original url, or send message if deleted or expired
 * @param request
 * @param response
 */
const goToUrl = (request, response) => {
    let shortUrl = request.originalUrl.replace('/s_', '')

    db.ShortUrl.findOne({
        where: {
            short_url: shortUrl
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
const db = require('../models')
const {Model} = require('sequelize')
const moment = require('moment')
const {validationResult} = require("express-validator");

class ShortUrl extends Model {
}

const list = (request, response) => {
    let data = db.ShortUrl.findAll()

    response.status(200).send({
        status: 'success',
        data: data
    })
}

// todo: Add process for ShortUrl
const add = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
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

}

// todo: Delete process for ShortUrl
const deleteData = (request, response) => {

}

/**
 * todo: GoTo process for ShortUrl
 * flow: This part use the shortened url and then redirect to original url, or send message if deleted or expired
 * @param request
 * @param response
 */
const goToUrl = (request, response) => {
    // let body = request.body

    let shortUrl = request.originalUrl.replace('/s_','')

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
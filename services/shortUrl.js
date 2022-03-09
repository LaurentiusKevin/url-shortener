const db = require('../models')
const {Model} = require('sequelize')
const moment = require('moment')

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
    let timestamp = moment.now()
    let data = response.body

    db.ShortUrl.findAll({
        where: {
            short_url: data.short_url
        }
    }).then(data => {
        if (data.length > 0) {
            response.status(406).send({
                status: 'failed',
                message: 'short_url not available'
            })
        } else {
            let data = {
                name: data.name,
                short_url: data.short_url,
                original_url: data.original_url,
                createdAt: timestamp,
                updatedAt: timestamp
            }

            db.ShortUrl.create(data)

            response.status(200).send({
                status: 'success',
                data: data
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

}

module.exports = {
    list,
    add,
    edit,
    deleteData,
    goToUrl
}
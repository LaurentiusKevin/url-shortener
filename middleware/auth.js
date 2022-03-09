const jwt = require('jsonwebtoken')
const password = require('../utils/password')

const verifyToken = (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers['x-access-token']

    if (!token) {
        return response.status(403)
            .send({
                status: 'failed',
                message: 'Token required'
            })
    }

    try {
        const decoded = jwt.verify(token, password.secret)
        request.user = decoded
    } catch (e) {
        return response.status(401)
            .send({
                status: 'failed',
                message: 'Invalid token.'
            })
    }
    return next()
}

module.exports = verifyToken
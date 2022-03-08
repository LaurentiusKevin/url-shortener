const crypto = require('crypto')

const secret = 'df1v6t91xtyxjh16'

const hash = (string) => {
    let sha256 = crypto.createHmac('sha256',secret)
    
    return sha256.update(string).digest('hex')
}

const check = (hashedString,plainString) => {
    let sha256 = crypto.createHmac('sha256',secret)

    return hashedString === sha256.update(plainString).digest('hex');
}

module.exports = {
    hash,
    check
}
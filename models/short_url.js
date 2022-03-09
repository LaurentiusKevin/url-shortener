const {DataTypes} = require('sequelize')

const ShortUrls = (sequelize) => {
    return sequelize.define('short_url', {
        name: {
            type: DataTypes.STRING(240),
        },
        short_url: {
            type: DataTypes.TEXT,
        },
        original_url: {
            type: DataTypes.TEXT,
        },
        expiredAt: {
            type: DataTypes.DATE,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    })
}

module.exports = ShortUrls
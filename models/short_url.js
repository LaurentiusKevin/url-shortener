const {DataTypes} = require('sequelize')

const Users = (sequelize) => {
    const Users = sequelize.define('short_url', {
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

    return Users
}

module.exports = Users
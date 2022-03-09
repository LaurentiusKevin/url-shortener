const {DataTypes} = require('sequelize')

const Users = (sequelize) => {
    return sequelize.define('users', {
        name: {
            type: DataTypes.STRING(240),
        },
        username: {
            type: DataTypes.STRING(240),
        },
        password: {
            type: DataTypes.STRING(240),
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    })
}

module.exports = Users
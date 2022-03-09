const {DataTypes} = require('sequelize')

const Users = (sequelize) => {
    const Users = sequelize.define('users', {
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

    return Users
}

module.exports = Users
/* jshint indent: 2 */
import Sequelize from 'sequelize'
export default function (sequelize, DataTypes) {
    return sequelize.define('usertest', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        account: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        },
        wxid: {
            type: Sequelize.STRING
        },
        organizationid: {
            type: DataTypes.INTEGER(11)
        },
        deleteStatus:{
            type: DataTypes.INTEGER(11)
        }
    }, {
            tableName: 'usertest',
            timestamps: false
        })
};

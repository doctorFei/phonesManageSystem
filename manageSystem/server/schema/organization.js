/* jshint indent: 2 */
import Sequelize from 'sequelize'
export default function (sequelize, DataTypes) {
    return sequelize.define('organization', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        deleteStatus:{
            type: DataTypes.INTEGER(11)
        }
    }, {
            tableName: 'organization',
            timestamps: false
        })
};

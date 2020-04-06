/* jshint indent: 2 */
import Sequelize from 'sequelize'
import moment from 'moment'
export default function (sequelize, DataTypes) {
    return sequelize.define('headset', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        brand: {
            type: Sequelize.STRING
        },
        SN: {
            type: Sequelize.STRING
        },
        color: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        finishType: {
            type: Sequelize.STRING
        },
        remark: {
            type: Sequelize.STRING
        },
        borrowstatus: {
            type: Sequelize.STRING
        },
        borrowname: {
            type: DataTypes.INTEGER(11)
        },
        addtime: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('addtime')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        borrowtime: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('borrowtime')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        deleteStatus:{
            type: DataTypes.INTEGER(11)
        }
    }, {
            tableName: 'headset',
            timestamps: false
        })
};



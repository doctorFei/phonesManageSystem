/* jshint indent: 2 */
import Sequelize from 'sequelize'
import moment from 'moment'
export default function (sequelize, DataTypes) {
    return sequelize.define('phonelist', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        img: {
            type: Sequelize.STRING
        },
        platform: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        imei: {
            type: Sequelize.STRING
        },
        system: {
            type: Sequelize.STRING
        },
        describe: {
            type: Sequelize.STRING
        },
        quality: {
            type: Sequelize.STRING
        },
        question: {
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
            tableName: 'phonelist',
            timestamps: false
        })
};



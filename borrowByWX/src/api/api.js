import axios from 'axios'
import { wxcode } from '../store/getters';

const login = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/login/login', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}
const nameToToken = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/login/getToken', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}
const getUserByWXID = async function (obj) {
    
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/login/getUserByWXID', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}

const getUserByAccount = async function (obj) {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/user/getUserByName', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}

const updateUser = async function (obj) {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/user/operateUSer', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}

const searchPhoneById = async function (obj) {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/phonelist/searchPhoneById', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}

const borrowPhone = async function (obj) {
    return new Promise((resolve, reject) => {
        const result = axios.post('http://61.191.24.229:5021/phoneManageSystem/phonelist/operatePhone', obj) // 将信息发送给后端
        result.then((res) => {
            resolve(res)
        }, (err) => {
            reject(err)
        })
    });
}
const getWXUserInfo = async function (wxcode) {
    return new Promise((resolve, reject) => {
        $.post('//yd.voicecloud.cn/lxactserver/h5/getuserinfo', {
            usercode: wxcode
        }, function(data) {
            if(data.errorcode != "000000") {
                reject(data)
            } else {
                resolve(data.result)
            }
        });
    });
}

export default {
    login,
    nameToToken,
    getUserByWXID,
    getUserByAccount,
    updateUser,
    searchPhoneById,
    borrowPhone,
    getWXUserInfo
}

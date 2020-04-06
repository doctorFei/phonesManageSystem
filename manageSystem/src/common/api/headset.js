const searchHeadsetPage = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/headset/searchHeadsetPage', obj)
        result.then((res) => {
            if (res.data.returnCode == '000005') {
                reject('err')
            } else {
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const getSearchList = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/headset/getSearchList', obj)
        result.then((res) => {
            if (res.data.returnCode == '000005') {
                reject('err')
            } else {
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const createHeadset = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/headset/operateHeadset', obj)
        result.then((res) => {
            if (res.data.returnCode == '000005') {
                reject('err')
            } else {
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const updateHeadset = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/headset/operateHeadset', obj)
        result.then((res) => {
            if (res.data.returnCode == '000005') {
                reject('err')
            } else {
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const deleteHeadset = async (id) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/headset/deleteHeadset', { id: id })
        result.then((res) => {
            if (res.data.returnCode == '000005') {
                reject('err')
            } else {
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
function _errorFn() {
    // sessionStorage.setItem('login-token',null)
    // window.location.href=window.location.href.split('#')[0]
}

export default {
    searchHeadsetPage,
    getSearchList,
    createHeadset,
    deleteHeadset,
    updateHeadset
}

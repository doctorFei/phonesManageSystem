const searchBookPage = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/book/searchBookPage', obj)
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
        const result = axios.post('/phoneManageSystem/book/getSearchList', obj)
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
const createBook = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/book/operateBook', obj)
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
const updateBook = async (obj) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/book/operateBook', obj)
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
const deleteBook = async (id) => {
    return new Promise((resolve, reject) => {
        const result = axios.post('/phoneManageSystem/book/deleteBook', { id: id })
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
    searchBookPage,
    getSearchList,
    createBook,
    deleteBook,
    updateBook
}

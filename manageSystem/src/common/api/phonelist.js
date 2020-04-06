
const getSearchClassify=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/getSearchClassify')
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const searchPhoneList=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/searchPhonelist',obj)
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const searchPhoneListAll=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/searchPhonelistAllNum',obj)
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}
const deletePhone=async (id)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/deletePhone',{
            id:id
        })
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}

const createPhone=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/operatePhone',obj)
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}

const updatePhone=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/operatePhone',obj)
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}

const operateUSer=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/phonelist/operateUSer',obj)
        result.then((res) => {
            if(res.data.returnCode=='000005'){
                reject('err')
            }else{
                resolve(res.data)
            }
        }, (err) => {
            _errorFn()
            reject(err)
        })
    })
}


function _errorFn(){
    // sessionStorage.setItem('login-token',null)
    // window.location.href=window.location.href.split('#')[0]
}

export default {
    getSearchClassify,
    searchPhoneList,
    deletePhone,
    createPhone,
    updatePhone,
    searchPhoneListAll
}

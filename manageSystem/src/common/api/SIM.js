const searchSIMPage=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/SIM/searchSIMPage',obj)
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
const getAllUser=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/SIM/getAllUser',obj)
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
const createSIM=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/SIM/operateSIM',obj)
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
const updateSIM=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/SIM/operateSIM',obj)
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
const deleteSIM=async (id)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/SIM/deleteSIM',{id:id})
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
    searchSIMPage,
    getAllUser,
    createSIM,
    deleteSIM,
    updateSIM
}

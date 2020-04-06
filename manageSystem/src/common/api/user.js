
const getAllOrganization =async ()=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/user/getAllOrganization')
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
const deleteDate=async (id)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/user/deleteUser',{'id':id})
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
const searchUserList=async (obj)=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/user/searchUserList',obj)
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
        const result= axios.post('/phoneManageSystem/user/operateUSer',obj)
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
const getAllUser=async ()=>{
    return new Promise((resolve,reject)=>{
        const result= axios.post('/phoneManageSystem/user/getAllUser')
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
    getAllOrganization,
    deleteDate,
    searchUserList,
    operateUSer,
    getAllUser
}

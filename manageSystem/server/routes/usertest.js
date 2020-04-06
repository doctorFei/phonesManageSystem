import auth from '../controllers/usertest.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/getAllUser', auth.getAllUser)
// router.post('/wxUSer', auth.wxUSer)
router.post('/getUserByName', auth.getUserByName)
router.post('/operateUSer', auth.operateUSer)
router.post('/deleteUser', auth.deleteUser) 
router.post('/getAllOrganization', auth.getAllOrganization) 
router.post('/searchUserList', auth.searchUserList) 

export default router

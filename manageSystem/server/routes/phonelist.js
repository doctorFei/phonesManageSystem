import api from '../controllers/phonelist.js'
import koaRouter from 'koa-router'
import upload from '../api/getpath.js'
const router = koaRouter()

router.post('/getSearchClassify', api.getSearchClassify)
router.post('/deletePhone', api.deletePhone)
router.post('/operatePhone', api.operatePhone)
router.post('/searchPhonelist', api.searchPhonelist)
router.post('/searchPhoneById', api.searchPhoneById)
router.post('/searchPhonelistAllNum', api.searchPhonelistAllNum)

export default router

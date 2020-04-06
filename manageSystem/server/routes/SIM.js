import api from '../controllers/SIM.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/searchSIMPage', api.searchSIMPage)
router.post('/getAllUser', api.getAllUser)
router.post('/operateSIM', api.operateSIM)
router.post('/deleteSIM', api.deleteSIM)
export default router

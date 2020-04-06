import api from '../controllers/headset.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/searchHeadsetPage', api.searchHeadsetPage)
router.post('/getSearchList', api.getSearchList)
router.post('/operateHeadset', api.operateHeadset)
router.post('/deleteHeadset', api.deleteHeadset)
export default router

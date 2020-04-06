import auth from '../controllers/usertest.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/login', auth.login)
router.post('/getToken', auth.nameToToken)
router.post('/getUserByWXID', auth.getUserByWXID)
export default router

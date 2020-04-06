import api from '../controllers/book.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/searchBookPage', api.searchBookPage)
router.post('/getSearchList', api.getSearchList)
router.post('/operateBook', api.operateBook)
router.post('/deleteBook', api.deleteBook)
export default router

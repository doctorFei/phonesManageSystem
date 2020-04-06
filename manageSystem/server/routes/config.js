import koaRouter from 'koa-router'
import phonelist from './phonelist.js'
import usertest from './usertest.js'
import upload from './upload.js'
import login from './login.js'
import SIM from './SIM.js'
import book from './book.js'
import headset from './headset.js'
import jwt from 'koa-jwt'
const tokenError = require('../api/token');

const router = koaRouter()

router.use('/phoneManageSystem/login', login.routes())
router.use('/phoneManageSystem/upload', upload.routes())
router.use('/phoneManageSystem/user', jwt({ secret: 'lxPhone' }), usertest.routes())
router.use('/phoneManageSystem/phonelist', jwt({ secret: 'lxPhone' }), phonelist.routes())
router.use('/phoneManageSystem/SIM', jwt({ secret: 'lxPhone' }), SIM.routes())
router.use('/phoneManageSystem/book', jwt({ secret: 'lxPhone' }), book.routes())
router.use('/phoneManageSystem/headset', jwt({ secret: 'lxPhone' }), headset.routes())
export default router

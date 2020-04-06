import upload from '../api/getpath.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/uploadImg', upload.single('file'), async (ctx, next) => {
    console.log('abc')
    ctx.body = {
        filename: ctx.req.file.filename//返回文件名
    }
})

export default router
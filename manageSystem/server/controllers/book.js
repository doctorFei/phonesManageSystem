import Book from '../models/book.js'

const getSearchList = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await Book.getSearchList()
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}


const searchBookPage = async (ctx) => {
    try {
        if (!!ctx.user) {
            const result = await Book.searchBookPage(ctx.request.body)
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}

const operateBook = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role !='游客' ) {
            if (!!ctx.request.body.id) {
                const result = await Book.updateBook(ctx.request.body)
                ctx.body = result
            } else {
                const result = await Book.createBook(ctx.request.body)
                ctx.body = result
            }
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }

}

const deleteBook = async (ctx) => {
    try {
        if (!!ctx.user && ctx.user.role == '超级管理员' || ctx.user.role == '管理员') {
            const result = await Book.deleteBook(ctx.request.body.id)
            ctx.body = result
        } else {
            ctx.body = {
                returnCode: '000005',
                success: false,
                message: 'token认证失败'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: err
        }
    }
}

export default {
    getSearchList,
    searchBookPage,
    operateBook,
    deleteBook
}

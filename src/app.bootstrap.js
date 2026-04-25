import { NODE_ENV, port } from '../config/config.service.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'
import cors from 'cors'
import { connectDB } from './DB/connection.db.js'
import { connectRedis } from './DB/redis.connection.db.js'
import helmet from 'helmet'

async function bootstrap() {
    const app = express()
    await connectDB()
    await connectRedis()
    
    app.use(cors(), helmet(), express.json())
    app.use('/Upload', express.static('../Upload'))
    app.use(express.urlencoded({ extended: true }))

    app.get('/', (req, res) => res.send('Saraha App API is Online!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)

    app.use((req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    app.use((error, req, res, next) => {
        const status = error.status || error.cause?.status || 500
        return res.status(status).json({
            success: false,
            message: status === 500 ? 'something went wrong' : error.message || 'something went wrong',
            stack: NODE_ENV === "development" ? error.stack : undefined
        })
    })

    app.listen(port, () => {
        console.log(`🚀 Server is live on port ${port}`)
    })
}

export default bootstrap

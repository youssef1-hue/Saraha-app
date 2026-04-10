import { APPKICATION_NAME, NODE_ENV, port } from '../config/config.service.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'
import cors from 'cors'
import { connectDB } from './DB/connection.db.js'
import { connectRedis } from './DB/redis.connection.db.js'
import { emailTemplate, sendEmail } from './common/utils/index.js'
import { createNumberOtp } from './common/utils/otp.js'
import helmet from 'helmet'

async function bootstrap() {
    try {
        const app = express()
        
        app.use(cors(), helmet(), express.json())
        app.use('/Upload', express.static('../Upload'))
        app.use(express.urlencoded({ extended: true }))

        app.get('/', (req, res) => res.status(200).send('API IS LIVE'))
        app.use('/auth', authRouter)
        app.use('/user', userRouter)

        app.use((req, res) => res.status(404).json({ message: "Invalid routing" }))

        app.use((error, req, res, next) => {
            const status = error.status || 500
            return res.status(status).json({
                success: false,
                message: error.message || 'Internal Server Error'
            })
        })

        app.listen(port, () => {
            console.log(`🚀 Server started on port ${port}`)
            
            // تشغيل الخدمات في الخلفية بعد التأكد من أن السيرفر "قام"
            connectDB().catch(err => console.log("DB Error:", err.message))
            connectRedis().catch(err => console.log("Redis Error:", err.message))
        })
    } catch (criticalError) {
        console.error("FATAL ERROR DURING BOOTSTRAP:", criticalError.message)
    }
}

export default bootstrap

import { APPKICATION_NAME, NODE_ENV, port } from '../config/config.service.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'
import cors from 'cors'
import { connectDB } from './DB/connection.db.js'
import { connectRedis } from './DB/redis.connection.db.js'
import { emailTemplate, sendEmail } from './common/utils/index.js'
import { createNumberOtp } from './common/utils/otp.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'


async function bootstrap() {
    const app = express()
    //convert buffer data
    app.use(cors() ,helmet(),express.json())
    app.use('/Upload', express.static('../Upload'))
    app.use(express.urlencoded({ extended: true }));

    // DB connection
    try {
        await connectDB();
    await connectRedis();
const code = await createNumberOtp();

await sendEmail({
  to: "velorasportswear19@gmail.com",
  cc: ["petersaad131@gmail.com"],
  subject: "Confirm Email",
  html: emailTemplate({
    title: "Confirm Email",
    code: code
  })
});
        
    } catch (emailError) {
        console.error("Email service failed but server is still running:", emailError.message);
    }
    

    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)


    //invalid routing
    app.use((req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use((error, req, res, next) => {
        const status = error.status || error.cause?.status || 500;
        return res.status(status).json({
            success: false,
            message: status === 500 ? 'something went wrong' : error.message || 'something went wrong',
            extra: error.extra || undefined,
            stack: NODE_ENV === "development" ? error.stack : undefined
        });
    });
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap
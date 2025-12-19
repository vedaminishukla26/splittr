import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import helmet from 'helmet'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import groupRoutes from './routes/groupRoutes.js'

dotenv.config()
connectDB()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        timestamp: new Date()
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
import express from 'express'
import cors from 'cors'
import helment from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import helmet from 'helmet'

dotenv.config()

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
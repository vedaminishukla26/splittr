import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
       expiresIn: '30d' 
    })
}

const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        console.log(name, email, password)
        const userExits = await User.findOne({ email });
        if(userExits) {
            return res.status(400).json({ message: 'User already exists.' })
        }

        const user = await User.create({ name, email, password });

        if(user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }); 
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error)
            return res.status(400).json({ 
                message: error.message
            })
        }
        return res.status(500).json({ message: error.message || 'Server Error' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid data' });
    }
}
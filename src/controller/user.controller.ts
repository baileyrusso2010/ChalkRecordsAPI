import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." })
    }
    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." })
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials." })
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" })
        return res.json({ token })
    } catch (err) {
        return res.status(500).json({ message: "Server error." })
    }
}

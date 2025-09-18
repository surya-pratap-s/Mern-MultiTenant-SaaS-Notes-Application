import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/mongodb.js';

export function signToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

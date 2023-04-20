import jwt from 'jsonwebtoken';
const SECRET = 'CODER_SECRET';
export function generateToken(user) {
    const token = jwt.sign({user}, SECRET, {expiresIn:'24h'});
    return token
}
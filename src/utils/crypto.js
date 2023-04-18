import bcrypt from 'bcrypt'

async function createHash(password) {
    return await bcrypt.hash(password, bcrypt.genSalt(10))
}

async function isValidPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export {createHash, isValidPassword}
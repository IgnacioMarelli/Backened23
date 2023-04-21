import bcrypt from 'bcrypt'

async function createHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt); 
    return hash;
}

async function isValidPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export {createHash, isValidPassword}
import { compareSync, hashSync } from "bcrypt"

export const createCrypt = (password) => {
    return hashSync(password, 10)
}

export const compareCrypt = (password, data) => {
    return compareSync(password, data)
}
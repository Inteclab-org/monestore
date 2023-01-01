 
 

import path from "path"
const { dirname } = path
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import mime from "mime-types"
import { v4 } from "uuid"

export const uploadFile = async (files, folder) => {
    const names = []
    if (Array.isArray(files)) {
        for await (const file of files) {
            const ext = mime.extension(file['mimetype'])
            const filename = `${v4() + "." + ext}`
            await file.mv(path.join(__dirname, "..", "uploads", folder, filename))
            names.push(filename)
        }
    }else {
        const ext = mime.extension(files['mimetype'])
        const filename = `${v4() + "." + ext}`
        await files.mv(path.join(__dirname, "..", "uploads", folder, filename))
        names.push(filename)
    }

    return {
        filenames: names
    }
}
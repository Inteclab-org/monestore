const path = require("path")
const mime = require("mime-types")
const { v4: uuidv4 } = require("uuid");

module.exports.uploadFile = async (files, folder) => {
    const names = []
    if (Array.isArray(files)) {
        for await (const file of files) {
            const ext = mime.extension(file['mimetype'])
            const filename = `${uuidv4() + "." + ext}`
            await file.mv(path.join(__dirname, "..", "uploads", folder, filename))
            names.push(filename)
        }
    }else {
        const ext = mime.extension(files['mimetype'])
        const filename = `${uuidv4() + "." + ext}`
        await files.mv(path.join(__dirname, "..", "uploads", folder, filename))
        names.push(filename)
    }

    return {
        filenames: names
    }
}
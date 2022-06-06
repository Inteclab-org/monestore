const request = require("request")
const fs = require("fs")
const path = require("path")
const configs = require('../config')

module.exports.fileDownloader = async function(file){
    try {
        let url = `https://api.telegram.org/file/bot${configs.TG_TOKEN}/photos/${file.file_path}`

        request.head(url, (err, res, body) => {
            request(url).pipe(fs.createWriteStream(path.join(__dirname, "..", "uploads", "files", file.file_id + ".jpg"))).on('close', () => {
                console.log("file saved");
            });
          });
    } catch (error) {
        console.log(error);
    }
}
const request = require("request")
const fs = require("fs")
const path = require("path")
const configs = require('../config')

function fileDownloader(file){
    try {
        let url = `http://api.telegram.org/file/bot${configs.TG_TOKEN}/${file.file_path}`

        request.head(url, (err, res, body) => {
            let result = request(url).pipe(fs.createWriteStream(path.join(__dirname, "..", "uploads", "files", file.file_id + ".jpg"))).on('close', () => {
                console.log("Downloaded");
            });
            console.log(result);
          });
    } catch (error) {
        console.log("Downloader error",error);
    }
}

module.exports = fileDownloader
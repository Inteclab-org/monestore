const request = require("request")
const fs = require("fs")
const path = require("path")

module.exports.fileDownloader = async function(file){
    try {
        let url = `https://api.telegram.org/file/bot5384545061:AAG76jxC0S9gOwcJJ6tmjDJ4vlXDtkzKcOg/photos/${file.file_path}`

        request.head(url, (err, res, body) => {
            request(url).pipe(fs.createWriteStream(path.join(__dirname, "..", "uploads", "files", file.file_id + ".jpg"))).on('close', () => {
                console.log("file saved");
            });
          });
    } catch (error) {
        console.log(error);
    }
}
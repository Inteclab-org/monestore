const { default: fetch } = require("node-fetch");

module.exports.fileDownloader = async function(filePath){
    try {
        const f = await fetch(`https://api.telegram.org/file/bot5384545061:AAG76jxC0S9gOwcJJ6tmjDJ4vlXDtkzKcOg/photos/${filePath}`)

        return f
    } catch (error) {
        console.log(error);
    }
}
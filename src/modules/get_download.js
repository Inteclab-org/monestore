 
 

import request from "request"
import fs from "fs"
import path from "path"
const { dirname } = path
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import configs from '../config/index.js'

export const fileDownloader = async function(file, file_id){
    try {
        let url = `http://api.telegram.org/file/bot${configs.TG_TOKEN}/${file.file_path}`

        request.head(url, (err, res, body) => {
            request(url).pipe(fs.createWriteStream(path.join(__dirname, "..", "uploads", "files", file_id + ".jpg"))).on('close', () => {});
          });
    } catch (error) {
        console.log("Downloader error",error);
    }
}
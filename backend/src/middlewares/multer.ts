import multer from "multer"
import fs from "node:fs"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync('/my-uploads')){
            fs.mkdirSync("my-uploads" )
        }
      cb(null, '/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
   export const upload = multer({ storage: storage })
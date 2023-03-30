const multer = require ('multer')

const imgconfig=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./images')
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`);
    }
})

const image_upload=multer({
    storage:imgconfig,
})


module.exports = {image_upload}
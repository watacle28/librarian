require('dotenv').config();
const cloudinary = require('cloudinary')
const cloudStorage = require('multer-storage-cloudinary')
const multer = require('multer')


//config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

const storage = cloudStorage({
    cloudinary,
    folder: 'myLibrary',
    allowedFormats: ['jpg','png'],
    filename: (req,file,cb)=> cb(undefined,Date.now() + '-book')

})

const uploader = multer({storage})

module.exports = uploader;
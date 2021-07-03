const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const config = require('config');

cloudinary.config({
  cloud_name: config.get('CLOUDINARY_NAME'),
  api_key: config.get('CLOUDINARY_API_KEY'),
  api_secret: config.get('CLOUDINARY_API_SECRET')
});

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'files',
    
//   }
// })

// const uploader = multer({storage});

module.exports = cloudinary;
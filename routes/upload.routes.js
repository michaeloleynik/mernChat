const {Router} = require('express');
const UploadFile = require('../models/UploadFile');

const cloudinary = require('../core/cloudinary');

const router = Router();

router.post(
  '/uploadFile',
  // uploader.single("file"),
  async (req, res) => {
    try {
      const { file } = req.body;
      const result = await cloudinary.uploader.upload(file, {folder: 'files'});
      res.status(200).json({message: 'success', image: result.url});
    } catch (e) {
      res.status(500).json({message: "Something went wrong...", status: 500});
    }
  }
)

module.exports = router;
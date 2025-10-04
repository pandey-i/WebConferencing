const Image = require('../models/Image');
const cloudinary = require('cloudinary').v2;
const randomstring = require('randomstring');
const store = require('../store');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  const image = req.files.image;
  const { crop } = req.fields;

  if (!image) {
    return res.status(500).json({ status: 500, error: 'FILE_REQUIRED' });
  }

  const shield = randomstring.generate({ length: 32, charset: 'alphanumeric', capitalization: 'lowercase' });

  let imageObject = new Image({
    name: image.name,
    author: req.user.id,
    size: image.size,
    shield,
  });

  await imageObject.save();

  const shieldedID = shield + imageObject._id;

  try {
    // Upload original image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      folder: `clover/${req.user.id}`,
      public_id: shieldedID,
      resource_type: 'image',
    });

    imageObject.location = result.secure_url;
    imageObject.shieldedID = shieldedID;

    // Optionally, create resized versions (thumbnails) using Cloudinary transformations
    // You can generate URLs with transformations on the frontend as needed

    await imageObject.save();

    res.status(200).json({ status: 200, image: imageObject });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ status: 500, error: 'UPLOAD_ERROR' });
  }
};

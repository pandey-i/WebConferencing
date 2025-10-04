const Image = require('../models/Image');
const cloudinary = require('cloudinary').v2;
const store = require('../store');
const randomstring = require('randomstring');

// Configure Cloudinary
cloudinary.config({
  cloud_name: store.config.cloudinary.cloud_name,
  api_key: store.config.cloudinary.api_key,
  api_secret: store.config.cloudinary.api_secret,
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
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      public_id: shieldedID,
      folder: `${req.user.id}`,
      transformation: crop === 'square' ? [{ width: 500, height: 500, crop: 'fill' }] : [],
    });

    imageObject.location = result.secure_url;
    imageObject.shieldedID = shieldedID;

    await imageObject.save();

    res.status(200).json({ status: 200, image: imageObject });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ status: 500, error: 'UPLOAD_ERROR' });
  }
};

const Images = require('../models/Image');

module.exports = (req, res, next) => {
  const { id, size } = req.params;

  Images.findOne({ shieldedID: id })
    .then((descriptor) => {
      if (!descriptor) return res.status(500).json({ error: 'Image not found' });

      let url = descriptor.location;

      // If size is specified, append Cloudinary transformation
      if (size) {
        // Assuming square crop for simplicity, adjust as needed
        url = url.replace('/upload/', `/upload/w_${size},h_${size},c_fill/`);
      }

      // Redirect to the Cloudinary URL
      res.redirect(url);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: 'Not Found' });
    });
};

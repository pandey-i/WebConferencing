# Clover Setup and Image Upload Fix

## Completed Tasks
- ✅ Added Cloudinary configuration to backend/config.js
- ✅ Updated backend/src/routes/upload.js to use Cloudinary for image uploads
- ✅ Updated backend/src/routes/images.js to properly handle Cloudinary URLs
- ✅ Added Cloudinary environment variables to backend/render.yaml

## Next Steps
1. **Set up Cloudinary account**: Create a free Cloudinary account at https://cloudinary.com
2. **Configure environment variables**:
   - In your local `.env` file (backend directory): Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   - In Render dashboard: Update the environment variables with your actual Cloudinary credentials
3. **Restart backend server** after setting environment variables
4. **Test image upload** functionality from the frontend
5. **Deploy changes** to production (Render backend, Netlify frontend)

## Environment Variables Needed
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Notes
- Images are now uploaded to Cloudinary instead of local file system
- This fixes the issue with images not being accessible on Render (ephemeral file system)
- The images route now properly serves Cloudinary URLs with optional size transformations

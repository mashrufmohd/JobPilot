const cloudinary = require('cloudinary').v2;
const config = require('../config');

// Configure Cloudinary
const initializeCloudinary = () => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.warn('⚠️  Cloudinary credentials not configured. Image upload features will be disabled.');
    return false;
  }

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true
  });

  console.log('✅ Cloudinary configured');
  return true;
};

// Initialize Cloudinary on module load
const isInitialized = initializeCloudinary();


const uploadImage = async (base64Data, options = {}) => {
  if (!isInitialized) {
    throw new Error('Cloudinary is not initialized');
  }

  try {
    const defaultOptions = {
      folder: 'company_uploads',
      resource_type: 'image',
      upload_preset: config.cloudinary.uploadPreset,
      ...options
    };

    const result = await cloudinary.uploader.upload(base64Data, defaultOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};


const uploadFromUrl = async (imageUrl, options = {}) => {
  if (!isInitialized) {
    throw new Error('Cloudinary is not initialized');
  }

  try {
    const defaultOptions = {
      folder: 'company_uploads',
      ...options
    };

    const result = await cloudinary.uploader.upload(imageUrl, defaultOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('❌ Cloudinary URL upload error:', error);
    throw new Error('Image upload from URL failed');
  }
};


const deleteImage = async (publicId) => {
  if (!isInitialized) {
    throw new Error('Cloudinary is not initialized');
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`✅ Image deleted from Cloudinary: ${publicId}`);
      return { success: true, message: 'Image deleted successfully' };
    } else {
      throw new Error('Image deletion failed');
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};


const getImageDetails = async (publicId) => {
  if (!isInitialized) {
    throw new Error('Cloudinary is not initialized');
  }

  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      createdAt: result.created_at
    };
  } catch (error) {
    console.error('❌ Cloudinary get details error:', error);
    throw new Error('Failed to get image details');
  }
};


const getTransformedUrl = (publicId, transformations = {}) => {
  if (!isInitialized) {
    throw new Error('Cloudinary is not initialized');
  }

  try {
    return cloudinary.url(publicId, {
      secure: true,
      ...transformations
    });
  } catch (error) {
    console.error('❌ Cloudinary transformation error:', error);
    throw new Error('Failed to generate transformed URL');
  }
};


const isCloudinaryUrl = (url) => {
  if (!url) return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};


const extractPublicId = (url) => {
  if (!isCloudinaryUrl(url)) return null;
  
  try {
    // Extract public ID from URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('❌ Error extracting public ID:', error);
    return null;
  }
};

module.exports = {
  uploadImage,
  uploadFromUrl,
  deleteImage,
  getImageDetails,
  getTransformedUrl,
  isCloudinaryUrl,
  extractPublicId,
  isInitialized: () => isInitialized
};

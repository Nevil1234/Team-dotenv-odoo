const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth.middleware');
const prisma = require('../lib/prisma');

// Upload user profile image
router.post('/profile-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const userId = req.user.id; // Get user ID from auth middleware

    // Check if user already has an image
    const existingImage = await prisma.userImage.findUnique({
      where: {
        userId: userId
      }
    });

    let userImage;
    if (existingImage) {
      // Update existing image
      userImage = await prisma.userImage.update({
        where: {
          userId: userId
        },
        data: {
          url: req.file.path
        }
      });
    } else {
      // Create new image
      userImage = await prisma.userImage.create({
        data: {
          url: req.file.path,
          userId: userId,
          isPrimary: true
        }
      });
    }

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        id: userImage.id,
        imageUrl: userImage.url
      }
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image',
      error: error.message
    });
  }
});

// Upload single image
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get productId from request body
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Create a new ProductImage record
    const image = await prisma.productImage.create({
      data: {
        url: req.file.path,
        productId: parseInt(productId),
        isPrimary: true // If it's a single image upload, we'll set it as primary
      }
    });

    console.log('Image saved to database:', image);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: image.id,
        imageUrl: image.url,
        isPrimary: image.isPrimary
      }
    });
  } catch (error) {
    console.error('Image upload error details:', {
      error: error,
      stack: error.stack,
      message: error.message,
      code: error.code
    });

    // Handle specific Prisma errors
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Product not found',
        error: 'The provided productId does not exist'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message || 'Unknown error occurred'
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  }
  next(error);
});

// Upload multiple images
router.post('/upload-multiple', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Create ProductImage records for all uploaded images
    const images = await Promise.all(req.files.map(async (file, index) => {
      return prisma.productImage.create({
        data: {
          url: file.path,
          productId: parseInt(productId),
          isPrimary: index === 0 // Set first image as primary
        }
      });
    }));

    console.log('Images saved to database:', images);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: images.map(img => ({
          id: img.id,
          imageUrl: img.url,
          isPrimary: img.isPrimary
        }))
      }
    });
  } catch (error) {
    console.error('Multiple images upload error details:', {
      error: error,
      stack: error.stack,
      message: error.message,
      code: error.code
    });

    // Handle specific Prisma errors
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Product not found',
        error: 'The provided productId does not exist'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;

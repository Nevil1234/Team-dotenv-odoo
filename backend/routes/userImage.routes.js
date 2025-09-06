const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { upload, cloudinary } = require('../config/cloudinary');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Upload user image
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Set all existing images to non-primary if this is marked as primary
    if (req.body.isPrimary === 'true') {
      await prisma.userImage.updateMany({
        where: { user: { id: req.user.userId } },
        data: { isPrimary: false }
      });
    }

    // Create new user image using the secure_url from Cloudinary
    const userImage = await prisma.userImage.create({
      data: {
        url: req.file.path,
        user: {
          connect: {
            id: req.user.userId // Using userId from JWT token
          }
        },
        isPrimary: req.body.isPrimary === 'true'
      }
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: userImage
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Get user images
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userImages = await prisma.userImage.findMany({
      where: { user: { id: req.user.userId } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(userImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});

// Delete user image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const image = await prisma.userImage.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.user.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete from Cloudinary
    const publicId = image.url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await prisma.userImage.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router;

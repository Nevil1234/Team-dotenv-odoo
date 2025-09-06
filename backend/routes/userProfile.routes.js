const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        address: true,
        user: {
          select: {
            email: true,
            displayName: true,
            image: {
              select: {
                url: true
              }
            }
          }
        }
      }
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create or update user profile
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, phoneNumber, address } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create or update profile using upsert
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: {
        fullName,
        phoneNumber,
        address: {
          upsert: {
            create: {
              ...address
            },
            update: {
              ...address
            }
          }
        }
      },
      create: {
        userId: req.user.id,
        fullName,
        phoneNumber,
        address: {
          create: {
            ...address
          }
        }
      },
      include: {
        address: true,
        user: {
          select: {
            email: true,
            displayName: true
          }
        }
      }
    });

    res.json(userProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Phone number already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user profile
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    await prisma.userProfile.delete({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

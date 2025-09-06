const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Add product to user's interaction (favorite, cart, wishlist, etc.)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, interaction, quantity, notes } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!productId || !interaction) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and interaction type are required'
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create or update user-product interaction
    const userProduct = await prisma.userProduct.upsert({
      where: {
        userId_productId_interaction: {
          userId: userId,
          productId: parseInt(productId),
          interaction: interaction
        }
      },
      update: {
        quantity: quantity || undefined,
        notes: notes || undefined,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        productId: parseInt(productId),
        interaction: interaction,
        quantity: quantity || null,
        notes: notes || null
      }
    });

    res.json({
      success: true,
      message: 'Product interaction added successfully',
      data: userProduct
    });
  } catch (error) {
    console.error('Error adding product interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product interaction',
      error: error.message
    });
  }
});

// Get user's interactions (favorites, cart items, etc.)
router.get('/:interaction', authMiddleware, async (req, res) => {
  try {
    const { interaction } = req.params;
    const userId = req.user.id;

    const userProducts = await prisma.userProduct.findMany({
      where: {
        userId: userId,
        interaction: interaction
      },
      include: {
        product: {
          include: {
            images: true,
            seller: {
              select: {
                id: true,
                displayName: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: userProducts
    });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user products',
      error: error.message
    });
  }
});

// Remove product from user's interaction
router.delete('/:productId/:interaction', authMiddleware, async (req, res) => {
  try {
    const { productId, interaction } = req.params;
    const userId = req.user.id;

    await prisma.userProduct.delete({
      where: {
        userId_productId_interaction: {
          userId: userId,
          productId: parseInt(productId),
          interaction: interaction
        }
      }
    });

    res.json({
      success: true,
      message: 'Product interaction removed successfully'
    });
  } catch (error) {
    console.error('Error removing product interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing product interaction',
      error: error.message
    });
  }
});

module.exports = router;

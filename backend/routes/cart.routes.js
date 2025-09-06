const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Add/Update product in cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
        availableQuantity: product.quantity
      });
    }

    // Check if product is already in cart
    const existingCartItem = await prisma.userProduct.findFirst({
      where: {
        userId,
        productId: parseInt(productId),
        interaction: 'CART'
      }
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity if already in cart
      cartItem = await prisma.userProduct.update({
        where: { id: existingCartItem.id },
        data: { quantity },
        include: {
          product: {
            include: {
              images: true,
              seller: {
                select: {
                  id: true,
                  displayName: true,
                  image: true
                }
              }
            }
          }
        }
      });
    } else {
      // Add new item to cart
      cartItem = await prisma.userProduct.create({
        data: {
          userId,
          productId: parseInt(productId),
          interaction: 'CART',
          quantity
        },
        include: {
          product: {
            include: {
              images: true,
              seller: {
                select: {
                  id: true,
                  displayName: true,
                  image: true
                }
              }
            }
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Product added to cart successfully',
      data: {
        ...cartItem,
        product: {
          ...cartItem.product,
          primaryImage: cartItem.product.images.find(img => img.isPrimary)?.url || cartItem.product.images[0]?.url
        }
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to cart',
      error: error.message
    });
  }
});

// Get cart items with detailed information
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all cart items for the user with detailed product and seller information
    const cartItems = await prisma.userProduct.findMany({
      where: {
        userId,
        interaction: 'CART'
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
                image: true,
                profile: {
                  select: {
                    fullName: true,
                    phoneNumber: true
                  }
                }
              }
            },
            productList: {
              select: {
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate cart summary
    const cartSummary = cartItems.reduce((summary, item) => {
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      
      summary.totalItems += item.quantity;
      summary.uniqueItems += 1;
      summary.subtotal += itemTotal;
      
      // Group by category
      const category = item.product.category;
      if (!summary.itemsByCategory[category]) {
        summary.itemsByCategory[category] = {
          count: 0,
          total: 0
        };
      }
      summary.itemsByCategory[category].count += item.quantity;
      summary.itemsByCategory[category].total += itemTotal;
      
      return summary;
    }, { 
      totalItems: 0, 
      uniqueItems: 0, 
      subtotal: 0,
      itemsByCategory: {}
    });

    // Format cart items
    const formattedCartItems = cartItems.map(item => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.title,
        category: item.product.category,
        imageUrl: item.product.images.find(img => img.isPrimary)?.url || item.product.images[0]?.url,
        price: parseFloat(item.product.price),
        stock: item.product.quantity,
        status: item.product.productList?.status || 'ACTIVE'
      },
      seller: {
        id: item.product.seller.id,
        name: item.product.seller.displayName,
        email: item.product.seller.email,
        image: item.product.seller.image?.url,
        phone: item.product.seller.profile?.phoneNumber
      },
      quantity: item.quantity,
      totalPrice: parseFloat(item.product.price) * item.quantity,
      addedAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.json({
      success: true,
      data: {
        cartDetails: {
          totalItems: cartSummary.totalItems,
          uniqueItems: cartSummary.uniqueItems,
          subtotal: parseFloat(cartSummary.subtotal.toFixed(2)),
          itemsByCategory: Object.entries(cartSummary.itemsByCategory).map(([category, data]) => ({
            category,
            itemCount: data.count,
            subtotal: parseFloat(data.total.toFixed(2))
          }))
        },
        items: formattedCartItems.map(item => ({
          ...item,
          itemTotal: parseFloat((item.quantity * item.product.price).toFixed(2))
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
});

// Update cart item quantity
router.patch('/update/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.userProduct.findFirst({
      where: {
        id: parseInt(itemId),
        userId,
        interaction: 'CART'
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check if enough stock is available
    if (cartItem.product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
        availableQuantity: cartItem.product.quantity
      });
    }

    // Update quantity
    const updatedCartItem = await prisma.userProduct.update({
      where: { id: parseInt(itemId) },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true,
            seller: {
              select: {
                id: true,
                displayName: true,
                image: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        ...updatedCartItem,
        product: {
          ...updatedCartItem.product,
          primaryImage: updatedCartItem.product.images.find(img => img.isPrimary)?.url || updatedCartItem.product.images[0]?.url,
          images: undefined
        }
      }
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.userProduct.findFirst({
      where: {
        id: parseInt(itemId),
        userId,
        interaction: 'CART'
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Remove item from cart
    await prisma.userProduct.delete({
      where: { id: parseInt(itemId) }
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all cart items for the user
    await prisma.userProduct.deleteMany({
      where: {
        userId,
        interaction: 'CART'
      }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;

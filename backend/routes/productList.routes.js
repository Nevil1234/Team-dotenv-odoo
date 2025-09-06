const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Create a product list entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, status } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        seller: true,
        productList: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product already has a list entry
    if (product.productList) {
      return res.status(400).json({
        success: false,
        message: 'Product already has a list entry'
      });
    }

    // Create product list entry
    const productList = await prisma.productList.create({
      data: {
        name: product.title,
        price: product.price,
        category: product.category,
        status: status || 'ACTIVE',
        productId: product.id,
        sellerId: product.sellerId
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

    res.status(201).json({
      success: true,
      message: 'Product list entry created successfully',
      data: productList
    });
  } catch (error) {
    console.error('Error creating product list entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product list entry',
      error: error.message
    });
  }
});

// Get all product listings with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status,
      sellerId,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build where clause for filtering
    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (sellerId) where.sellerId = parseInt(sellerId);
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get product listings
    const [productLists, total] = await Promise.all([
      prisma.productList.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.productList.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        items: productLists,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          hasMore: skip + productLists.length < total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching product listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product listings',
      error: error.message
    });
  }
});

// Update product list entry status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if product list exists and user is authorized
    const productList = await prisma.productList.findUnique({
      where: { id: parseInt(id) }
    });

    if (!productList) {
      return res.status(404).json({
        success: false,
        message: 'Product list entry not found'
      });
    }

    if (productList.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product list entry'
      });
    }

    // Update status
    const updatedProductList = await prisma.productList.update({
      where: { id: parseInt(id) },
      data: { status },
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
      message: 'Product list entry status updated successfully',
      data: updatedProductList
    });
  } catch (error) {
    console.error('Error updating product list entry status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product list entry status',
      error: error.message
    });
  }
});

// Delete product list entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product list exists and user is authorized
    const productList = await prisma.productList.findUnique({
      where: { id: parseInt(id) }
    });

    if (!productList) {
      return res.status(404).json({
        success: false,
        message: 'Product list entry not found'
      });
    }

    if (productList.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product list entry'
      });
    }

    // Delete product list entry
    await prisma.productList.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Product list entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product list entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product list entry',
      error: error.message
    });
  }
});

module.exports = router;

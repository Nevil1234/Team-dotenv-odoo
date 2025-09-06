const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Get user's purchase history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      startDate,
      endDate,
      sortBy = 'purchaseDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      userId
    };

    if (status) {
      where.status = status.toUpperCase();
    }

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = new Date(startDate);
      if (endDate) where.purchaseDate.lte = new Date(endDate);
    }

    // Get purchases with product and seller details
    const [purchases, totalPurchases] = await Promise.all([
      prisma.purchase.findMany({
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
                  image: true,
                  profile: {
                    select: {
                      fullName: true,
                      phoneNumber: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder.toLowerCase()
        },
        skip,
        take: parseInt(limit)
      }),
      prisma.purchase.count({ where })
    ]);

    // Calculate purchase statistics
    const stats = await prisma.purchase.aggregate({
      where: {
        userId,
        status: 'COMPLETED'
      },
      _count: {
        _all: true
      },
      _sum: {
        quantity: true,
        priceAtPurchase: true
      }
    });

    // Format purchases
    const formattedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      product: {
        id: purchase.product.id,
        name: purchase.product.title,
        category: purchase.product.category,
        primaryImage: purchase.product.images.find(img => img.isPrimary)?.url || 
                     purchase.product.images[0]?.url,
      },
      seller: {
        id: purchase.product.seller.id,
        name: purchase.product.seller.displayName,
        email: purchase.product.seller.email,
        image: purchase.product.seller.image?.url,
        phone: purchase.product.seller.profile?.phoneNumber
      },
      quantity: purchase.quantity,
      priceAtPurchase: purchase.priceAtPurchase,
      totalAmount: parseFloat(purchase.priceAtPurchase) * purchase.quantity,
      status: purchase.status,
      purchaseDate: purchase.purchaseDate,
      updatedAt: purchase.updatedAt
    }));

    res.json({
      success: true,
      data: {
        purchases: formattedPurchases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPurchases / parseInt(limit)),
          totalItems: totalPurchases,
          hasMore: skip + purchases.length < totalPurchases
        },
        summary: {
          totalPurchases: stats._count._all,
          totalItems: stats._sum.quantity || 0,
          totalSpent: stats._sum.priceAtPurchase ? parseFloat(stats._sum.priceAtPurchase) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase history',
      error: error.message
    });
  }
});

// Get purchase details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const purchase = await prisma.purchase.findFirst({
      where: {
        id: parseInt(id),
        userId
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
                    phoneNumber: true,
                    address: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Format purchase details
    const formattedPurchase = {
      id: purchase.id,
      product: {
        id: purchase.product.id,
        name: purchase.product.title,
        description: purchase.product.description,
        category: purchase.product.category,
        condition: purchase.product.condition,
        images: purchase.product.images.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary
        })),
        specifications: {
          brand: purchase.product.brand,
          model: purchase.product.model,
          yearOfManufacture: purchase.product.yearOfManufacture,
          dimensions: {
            length: purchase.product.length,
            width: purchase.product.width,
            height: purchase.product.height,
            weight: purchase.product.weight
          },
          material: purchase.product.material,
          color: purchase.product.color,
          hasOriginalPackaging: purchase.product.hasOriginalPackaging,
          hasManual: purchase.product.hasManual,
          workingCondition: purchase.product.workingCondition
        }
      },
      seller: {
        id: purchase.product.seller.id,
        name: purchase.product.seller.displayName,
        email: purchase.product.seller.email,
        image: purchase.product.seller.image?.url,
        phone: purchase.product.seller.profile?.phoneNumber,
        address: purchase.product.seller.profile?.address
      },
      purchase: {
        quantity: purchase.quantity,
        priceAtPurchase: purchase.priceAtPurchase,
        totalAmount: parseFloat(purchase.priceAtPurchase) * purchase.quantity,
        status: purchase.status,
        purchaseDate: purchase.purchaseDate,
        updatedAt: purchase.updatedAt
      }
    };

    res.json({
      success: true,
      data: formattedPurchase
    });
  } catch (error) {
    console.error('Error fetching purchase details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase details',
      error: error.message
    });
  }
});

module.exports = router;

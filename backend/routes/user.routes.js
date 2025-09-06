const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Get user's listings (products they're selling)
router.get('/listings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      includeStats = false
    } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      sellerId: userId
    };

    if (status) {
      where.productList = {
        status: status.toUpperCase()
      };
    }

    if (category) {
      where.category = category.toUpperCase();
    }

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    // Get user's listings with pagination
    const [listings, totalListings] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          productList: true,
          _count: {
            select: {
              userInteractions: {
                where: {
                  OR: [
                    { interaction: 'FAVORITE' },
                    { interaction: 'VIEWED' }
                  ]
                }
              }
            }
          },
          userInteractions: includeStats ? {
            where: {
              OR: [
                { interaction: 'FAVORITE' },
                { interaction: 'VIEWED' }
              ]
            }
          } : false
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    // Get additional stats if requested
    let listingStats = null;
    if (includeStats) {
      const stats = await prisma.product.aggregate({
        where: {
          sellerId: userId
        },
        _count: {
          _all: true
        },
        _sum: {
          quantity: true
        }
      });

      const statusCounts = await prisma.productList.groupBy({
        by: ['status'],
        where: {
          sellerId: userId
        },
        _count: {
          _all: true
        }
      });

      const categoryCounts = await prisma.product.groupBy({
        by: ['category'],
        where: {
          sellerId: userId
        },
        _count: {
          _all: true
        }
      });

      listingStats = {
        totalListings: stats._count._all,
        totalQuantity: stats._sum.quantity || 0,
        byStatus: Object.fromEntries(
          statusCounts.map(({ status, _count }) => [status, _count._all])
        ),
        byCategory: Object.fromEntries(
          categoryCounts.map(({ category, _count }) => [category, _count._all])
        )
      };
    }

    // Format listings
    const formattedListings = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      category: listing.category,
      condition: listing.condition,
      quantity: listing.quantity,
      status: listing.productList?.status || 'UNLISTED',
      primaryImage: listing.images.find(img => img.isPrimary)?.url || listing.images[0]?.url,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      stats: {
        views: listing._count.userInteractions,
        favorites: listing.userInteractions?.filter(i => i.interaction === 'FAVORITE').length || 0
      }
    }));

    res.json({
      success: true,
      data: {
        listings: formattedListings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalListings / parseInt(limit)),
          totalItems: totalListings,
          hasMore: skip + listings.length < totalListings
        },
        ...(listingStats && { stats: listingStats })
      }
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user listings',
      error: error.message
    });
  }
});

// Get listing statistics
router.get('/listings/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get basic listing stats
    const [basicStats, statusStats, categoryStats, interactionStats] = await Promise.all([
      // Basic stats
      prisma.product.aggregate({
        where: { sellerId: userId },
        _count: { _all: true },
        _sum: { quantity: true }
      }),

      // Status distribution
      prisma.productList.groupBy({
        by: ['status'],
        where: { sellerId: userId },
        _count: { _all: true }
      }),

      // Category distribution
      prisma.product.groupBy({
        by: ['category'],
        where: { sellerId: userId },
        _count: { _all: true }
      }),

      // Interaction stats (views and favorites)
      prisma.userProduct.groupBy({
        by: ['interaction'],
        where: {
          product: { sellerId: userId },
          interaction: { in: ['VIEWED', 'FAVORITE'] }
        },
        _count: { _all: true }
      })
    ]);

    // Calculate average price
    const priceStats = await prisma.product.aggregate({
      where: { sellerId: userId },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true }
    });

    // Format stats
    const stats = {
      overview: {
        totalListings: basicStats._count._all,
        totalQuantity: basicStats._sum.quantity || 0,
        averagePrice: Number(priceStats._avg.price) || 0,
        minPrice: Number(priceStats._min.price) || 0,
        maxPrice: Number(priceStats._max.price) || 0
      },
      statusDistribution: Object.fromEntries(
        statusStats.map(({ status, _count }) => [status, _count._all])
      ),
      categoryDistribution: Object.fromEntries(
        categoryStats.map(({ category, _count }) => [category, _count._all])
      ),
      interactions: Object.fromEntries(
        interactionStats.map(({ interaction, _count }) => [interaction.toLowerCase(), _count._all])
      )
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching listing statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listing statistics',
      error: error.message
    });
  }
});

// Get specific listing details
router.get('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const listing = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        sellerId: userId
      },
      include: {
        images: true,
        productList: true,
        userInteractions: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            userInteractions: {
              where: {
                OR: [
                  { interaction: 'FAVORITE' },
                  { interaction: 'VIEWED' }
                ]
              }
            }
          }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Format listing details
    const formattedListing = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      condition: listing.condition,
      quantity: listing.quantity,
      status: listing.productList?.status || 'UNLISTED',
      images: listing.images.map(img => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary
      })),
      specs: {
        yearOfManufacture: listing.yearOfManufacture,
        brand: listing.brand,
        model: listing.model,
        dimensions: {
          length: listing.length,
          width: listing.width,
          height: listing.height,
          weight: listing.weight
        },
        material: listing.material,
        color: listing.color,
        hasOriginalPackaging: listing.hasOriginalPackaging,
        hasManual: listing.hasManual,
        workingCondition: listing.workingCondition
      },
      stats: {
        views: listing._count.userInteractions,
        favorites: listing.userInteractions.filter(i => i.interaction === 'FAVORITE').length,
        recentViewers: listing.userInteractions
          .filter(i => i.interaction === 'VIEWED')
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 5)
          .map(i => ({
            userId: i.user.id,
            displayName: i.user.displayName,
            imageUrl: i.user.image?.url
          }))
      },
      dates: {
        created: listing.createdAt,
        updated: listing.updatedAt,
        listed: listing.productList?.createdAt
      }
    };

    res.json({
      success: true,
      data: formattedListing
    });
  } catch (error) {
    console.error('Error fetching listing details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listing details',
      error: error.message
    });
  }
});

module.exports = router;

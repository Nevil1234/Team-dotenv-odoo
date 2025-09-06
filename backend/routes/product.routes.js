const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth.middleware');

// Create a new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      price,
      quantity,
      condition,
      yearOfManufacture,
      brand,
      model,
      length,
      width,
      height,
      weight,
      material,
      color,
      hasOriginalPackaging,
      hasManual,
      workingCondition
    } = req.body;

    // Validation
    if (!title || !category || !description || !price || !quantity || !condition || !workingCondition) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        requiredFields: [
          'title',
          'category',
          'description',
          'price',
          'quantity',
          'condition',
          'workingCondition'
        ]
      });
    }

    // Create product with seller info from auth middleware
    const product = await prisma.product.create({
      data: {
        title,
        category,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        condition,
        yearOfManufacture: yearOfManufacture ? parseInt(yearOfManufacture) : null,
        brand: brand || null,
        model: model || null,
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        material: material || null,
        color: color || null,
        hasOriginalPackaging: hasOriginalPackaging || false,
        hasManual: hasManual || false,
        workingCondition,
        sellerId: req.user.id // Get seller ID from auth middleware
      },
      include: {
        images: true, // Include any associated images in the response
        seller: {
          select: {
            id: true,
            displayName: true,
            email: true,
            image: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
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
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get product by ID with detailed information
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get user ID if authenticated

    // Get the main product with all its details
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
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
                address: {
                  select: {
                    city: true,
                    state: true,
                    country: true
                  }
                }
              }
            }
          }
        },
        productList: true, // Get listing status
        _count: {
          select: {
            userInteractions: {
              where: {
                interaction: 'FAVORITE'
              }
            }
          }
        },
        userInteractions: userId ? {
          where: {
            userId: userId
          }
        } : false
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products (same category, different product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: {
          not: product.id
        }
      },
      take: 6,
      include: {
        images: {
          select: {
            url: true,
            isPrimary: true
          }
        },
        seller: {
          select: {
            id: true,
            displayName: true,
            image: {
              select: {
                url: true
              }
            }
          }
        },
        _count: {
          select: {
            userInteractions: {
              where: {
                interaction: 'FAVORITE'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format related products
    const formattedRelatedProducts = relatedProducts.map(relatedProduct => ({
      ...relatedProduct,
      primaryImage: relatedProduct.images.find(img => img.isPrimary)?.url || relatedProduct.images[0]?.url,
      favoriteCount: relatedProduct._count.userInteractions,
      images: undefined,
      _count: undefined
    }));

    // Format the main product data
    const formattedProduct = {
      ...product,
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
      favoriteCount: product._count.userInteractions,
      userInteractions: product.userInteractions || [],
      sellerLocation: {
        city: product.seller.profile?.address?.city,
        state: product.seller.profile?.address?.state,
        country: product.seller.profile?.address?.country
      },
      _count: undefined
    };

    // Get seller's other products
    const sellerOtherProducts = await prisma.product.findMany({
      where: {
        sellerId: product.sellerId,
        id: {
          not: product.id
        }
      },
      take: 4,
      include: {
        images: {
          select: {
            url: true,
            isPrimary: true
          }
        },
        _count: {
          select: {
            userInteractions: {
              where: {
                interaction: 'FAVORITE'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format seller's other products
    const formattedSellerProducts = sellerOtherProducts.map(sellerProduct => ({
      ...sellerProduct,
      primaryImage: sellerProduct.images.find(img => img.isPrimary)?.url || sellerProduct.images[0]?.url,
      favoriteCount: sellerProduct._count.userInteractions,
      images: undefined,
      _count: undefined
    }));

    res.json({
      success: true,
      data: {
        product: formattedProduct,
        relatedProducts: formattedRelatedProducts,
        sellerOtherProducts: formattedSellerProducts
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    // Check if product exists and user is the owner
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...req.body,
        // Parse numeric fields
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        quantity: req.body.quantity ? parseInt(req.body.quantity) : undefined,
        yearOfManufacture: req.body.yearOfManufacture ? parseInt(req.body.yearOfManufacture) : undefined,
        length: req.body.length ? parseFloat(req.body.length) : undefined,
        width: req.body.width ? parseFloat(req.body.width) : undefined,
        height: req.body.height ? parseFloat(req.body.height) : undefined,
        weight: req.body.weight ? parseFloat(req.body.weight) : undefined
      },
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
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    // Check if product exists and user is the owner
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Get all products grouped by category
router.get('/by-category', async (req, res) => {
  try {
    // First, get all available categories from the enum
    const categories = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::"ProductCategory"))::text AS category;
    `;

    // Get all products with their images and seller info, grouped by category
    const productsWithCategories = await Promise.all(
      categories.map(async ({ category }) => {
        const products = await prisma.product.findMany({
          where: {
            category: category
          },
          include: {
            images: {
              select: {
                url: true,
                isPrimary: true
              }
            },
            seller: {
              select: {
                id: true,
                displayName: true,
                image: {
                  select: {
                    url: true
                  }
                }
              }
            },
            _count: {
              select: {
                userInteractions: {
                  where: {
                    interaction: 'FAVORITE'
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        // Format products to include primary image and favorite count
        const formattedProducts = products.map(product => ({
          ...product,
          primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
          favoriteCount: product._count.userInteractions,
          images: undefined,
          _count: undefined
        }));

        return {
          category,
          products: formattedProducts
        };
      })
    );

    // Filter out categories with no products if requested
    const finalCategories = req.query.hideEmpty === 'true'
      ? productsWithCategories.filter(cat => cat.products.length > 0)
      : productsWithCategories;

    res.json({
      success: true,
      data: finalCategories
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get products for a specific category with pagination
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get products for the specified category
    const products = await prisma.product.findMany({
      where: {
        category: category.toUpperCase()
      },
      include: {
        images: {
          select: {
            url: true,
            isPrimary: true
          }
        },
        seller: {
          select: {
            id: true,
            displayName: true,
            image: {
              select: {
                url: true
              }
            }
          }
        },
        _count: {
          select: {
            userInteractions: {
              where: {
                interaction: 'FAVORITE'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalProducts = await prisma.product.count({
      where: {
        category: category.toUpperCase()
      }
    });

    // Format products
    const formattedProducts = products.map(product => ({
      ...product,
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
      favoriteCount: product._count.userInteractions,
      images: undefined,
      _count: undefined
    }));

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasMore: skip + products.length < totalProducts
        }
      }
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
});

module.exports = router;

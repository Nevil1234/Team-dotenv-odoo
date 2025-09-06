require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const productRoutes = require('./routes/product.routes');
const userProductRoutes = require('./routes/user-product.routes');
const userProfileRoutes = require('./routes/userProfile.routes');
const userImageRoutes = require('./routes/userImage.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user-products', userProductRoutes);
app.use('/api/users', userProfileRoutes); // Add user profile routes
app.use('/api/user-images', userImageRoutes); // Add user image routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code
  });

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  // Handle Prisma errors
  if (err.code?.startsWith('P')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message || 'Unknown error occurred'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

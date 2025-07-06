// server.js - Starter Express server

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.status = 401;
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware setup ---

// Logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parse JSON bodies
app.use(bodyParser.json());

// Authentication middleware (API key: 'my-secret-key')
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') &&
    req.method !== 'GET' // Only require API key for non-GET requests
  ) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== 'my-secret-key') {
      return next(new AuthError('Invalid or missing API key'));
    }
  }
  next();
});

// --- Sample in-memory products database ---
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// --- Validation middleware ---
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return next(new ValidationError('Invalid product data'));
  }
  next();
}

// --- Routes ---

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - List all products (with filtering, pagination, search)
app.get('/api/products', (req, res, next) => {
  try {
    let result = [...products];

    // Filtering by category
    if (req.query.category) {
      result = result.filter(p => p.category === req.query.category);
    }

    // Search by name (case-insensitive)
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(search));
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || result.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = result.slice(start, end);

    res.json({
      total: result.length,
      page,
      limit,
      products: paginated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product
app.post('/api/products', validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    const { name, description, price, category, inStock } = req.body;
    products[index] = {
      id: products[index].id,
      name,
      description,
      price,
      category,
      inStock
    };
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deleted[0] });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Product statistics (count by category)
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json({ countByCategory: stats });
  } catch (err) {
    next(err);
  }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;


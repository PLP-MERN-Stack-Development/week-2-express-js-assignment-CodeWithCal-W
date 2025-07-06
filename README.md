# Product API – Express.js

A RESTful API built with Express.js implementing standard CRUD operations, routing, middleware, error handling, filtering, pagination, search, and statistics.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
npm install
```

### Running the Server

```bash
node server.js
```

Server runs on [http://localhost:3000](http://localhost:3000) by default.

---

## 🛠️ API Endpoints

### Authentication

- For **POST**, **PUT**, and **DELETE** requests to `/api/products`, include header:  
  `x-api-key: my-secret-key`

---

### Root

**GET /**  
Returns a welcome message.

---

### Products

#### List Products

**GET /api/products**

Query Parameters:
- `category` – Filter by category
- `search` – Search by product name (case-insensitive)
- `page` – Page number (default: 1)
- `limit` – Items per page (default: all)

**Example:**  
`GET /api/products?category=electronics&page=1&limit=2`

**Response:**
```json
{
  "total": 2,
  "page": 1,
  "limit": 2,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

#### Get Product by ID

**GET /api/products/:id**

**Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

---

#### Create Product

**POST /api/products**  
Headers: `x-api-key: my-secret-key`

**Body:**
```json
{
  "name": "Blender",
  "description": "Powerful kitchen blender",
  "price": 99,
  "category": "kitchen",
  "inStock": true
}
```

**Response:**
```json
{
  "id": "generated-uuid",
  "name": "Blender",
  "description": "Powerful kitchen blender",
  "price": 99,
  "category": "kitchen",
  "inStock": true
}
```

---

#### Update Product

**PUT /api/products/:id**  
Headers: `x-api-key: my-secret-key`

**Body:**
```json
{
  "name": "Laptop Pro",
  "description": "Upgraded laptop with 32GB RAM",
  "price": 1500,
  "category": "electronics",
  "inStock": true
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Laptop Pro",
  "description": "Upgraded laptop with 32GB RAM",
  "price": 1500,
  "category": "electronics",
  "inStock": true
}
```

---

#### Delete Product

**DELETE /api/products/:id**  
Headers: `x-api-key: my-secret-key`

**Response:**
```json
{
  "message": "Product deleted",
  "product": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

---

#### Product Statistics

**GET /api/products/stats**

**Response:**
```json
{
  "countByCategory": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

---

## 🧪 Error Handling

**Not Found Example:**  
`GET /api/products/999`
```json
{
  "error": "NotFoundError",
  "message": "Product not found"
}
```

**Validation Example:**  
`POST /api/products` (with invalid body)
```json
{
  "error": "ValidationError",
  "message": "Invalid product data"
}
```

**Authentication Example:**  
`POST /api/products` (missing or wrong API key)
```json
{
  "error": "AuthError",
  "message": "Invalid or missing API key"
}
```

---

## 🧩 Features

- CRUD for products
- Filtering, pagination, and search
- Product statistics by category
- Custom middleware: logger, authentication, validation
- Global error handling

---

## 📫 Testing

Use [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or `curl` to test endpoints.

---

## License

MIT
# FMOSWEB E-commerce Website

A modern, responsive e-commerce website built with HTML, CSS, JavaScript, and PHP. Designed to work with free hosting services like infinityfree.com.

## Features

- Responsive design that works on all devices
- Product catalog with search and filtering
- Shopping cart functionality
- User authentication system
- Newsletter subscription
- Contact form
- Admin panel for managing products
- Database integration with MySQL

## Installation Instructions

### For infinityfree.com hosting:

1. **Download and Extract**
   - Download the ZIP file of this project
   - Extract all files to your computer

2. **Upload Files**
   - Login to your infinityfree.com control panel
   - Go to File Manager
   - Upload all files to the `htdocs` folder (or `public_html` depending on your setup)

3. **Database Setup**
   - Go to MySQL Databases in your control panel
   - Create a new database
   - Note down your database name, username, and password
   - Go to phpMyAdmin
   - Import the `database/schema.sql` file to create tables and sample data

4. **Configure Database**
   - Edit `config/database.php`
   - Update the database credentials with your actual values:
     \`\`\`php
     $host = 'sql200.infinityfree.com'; // Your database host
     $dbname = 'if0_12345678_fmosweb'; // Your actual database name
     $username = 'if0_12345678'; // Your actual username
     $password = 'your_actual_password'; // Your actual password
     \`\`\`

5. **Upload Images**
   - Create an `images` folder in your root directory
   - Upload your product images and logo
   - Make sure the image paths in the database match your uploaded files

## File Structure

\`\`\`
/
├── index.html              # Homepage
├── styles.css             # Main stylesheet
├── script.js              # Main JavaScript file
├── config/
│   └── database.php       # Database configuration
├── api/
│   ├── products.php       # Products API endpoint
│   ├── newsletter.php     # Newsletter subscription
│   └── contact.php        # Contact form handler
├── database/
│   └── schema.sql         # Database schema and sample data
├── images/                # Product images and assets
└── README.md             # This file
\`\`\`

## API Endpoints

- `GET /api/products.php?featured=1` - Get featured products
- `GET /api/products.php?id=1` - Get single product
- `GET /api/products.php` - Get all products with pagination
- `POST /api/newsletter.php` - Subscribe to newsletter
- `POST /api/contact.php` - Send contact message

## Customization

### Colors
The website uses a warm color scheme with amber/orange accents. To change colors, edit the CSS variables in `styles.css`.

### Products
Add new products by inserting records into the `products` table in your database, or create an admin panel for easier management.

### Images
Replace placeholder images with your actual product images. Make sure to update the image paths in the database.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is open source and available under the MIT License.

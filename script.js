// Global variables
const cart = JSON.parse(localStorage.getItem("cart")) || []
let isAuthModalOpen = false
let isMobileMenuOpen = false

// Featured products data
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "premium-wireless-headphones.png",
    badge: "Best Seller",
    badgeClass: "badge-bestseller",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 89,
    image: "smart-fitness-watch.png",
    badge: "New",
    badgeClass: "badge-new",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "portable-bluetooth-speaker.jpg",
    badge: "Sale",
    badgeClass: "badge-sale",
  },
  {
    id: 4,
    name: "Wireless Charging Pad",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 78,
    image: "wireless-charging-pad.png",
    badge: "Hot",
    badgeClass: "badge-hot",
  },
]

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  loadFeaturedProducts()
})

// Cart functions
function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "flex" : "none"
  }
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  // Show success message
  showNotification("Product added to cart!", "success")
}

// Load featured products
function loadFeaturedProducts() {
  const productsGrid = document.getElementById("productsGrid")
  if (!productsGrid) return

  productsGrid.innerHTML = featuredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='/diverse-products-still-life.png'">
                
                <div class="product-badge ${product.badgeClass}">
                    ${product.badge}
                </div>
                
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="savings">Save $${(product.originalPrice - product.price).toFixed(2)}</span>
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, "&quot;")})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Generate star rating HTML
function generateStars(rating) {
  let stars = ""
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fas fa-star star"></i>'
    } else {
      stars += '<i class="fas fa-star star empty"></i>'
    }
  }
  return stars
}

// Mobile menu functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuIcon = document.getElementById("menuIcon")

  isMobileMenuOpen = !isMobileMenuOpen

  if (isMobileMenuOpen) {
    mobileMenu.classList.add("active")
    menuIcon.className = "fas fa-times"
  } else {
    mobileMenu.classList.remove("active")
    menuIcon.className = "fas fa-bars"
  }
}

// Search functions
function handleSearch(event) {
  event.preventDefault()
  const searchInput = event.target.querySelector('input[type="text"]')
  const query = searchInput.value.trim()

  if (query) {
    // In a real application, you would redirect to a search results page
    // For now, we'll just show an alert
    showNotification(`Searching for: ${query}`, "info")

    // Close mobile menu if open
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }
}

// Auth modal functions
function openAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.add("active")
  isAuthModalOpen = true
  document.body.style.overflow = "hidden"
}

function closeAuthModal() {
  const modal = document.getElementById("authModal")
  modal.classList.remove("active")
  isAuthModalOpen = false
  document.body.style.overflow = "auto"
}

function handleAuth(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const email = formData.get("email")
  const password = formData.get("password")

  // In a real application, you would send this data to your server
  console.log("Auth attempt:", { email, password })

  // For demo purposes, just show success message and close modal
  showNotification("Authentication successful!", "success")
  closeAuthModal()
}

function switchToSignUp() {
  // In a real application, you would switch the modal content to sign up form
  showNotification("Sign up functionality would be implemented here", "info")
}

// Newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const email = formData.get("email") || event.target.querySelector('input[type="email"]').value

  if (email) {
    // In a real application, you would send this to your server
    console.log("Newsletter subscription:", email)
    showNotification("Successfully subscribed to newsletter!", "success")
    event.target.reset()
  }
}

// Wishlist functions
function toggleWishlist(productId) {
  // In a real application, you would manage wishlist in localStorage or server
  showNotification("Wishlist functionality would be implemented here", "info")
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add notification styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 1001;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-width: 300px;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                background: #059669;
            }
            
            .notification-error {
                background: #dc2626;
            }
            
            .notification-info {
                background: #2563eb;
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `
    document.head.appendChild(styles)
  }

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

// Close modal when clicking outside
document.addEventListener("click", (event) => {
  const modal = document.getElementById("authModal")
  if (event.target === modal) {
    closeAuthModal()
  }
})

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuButton = event.target.closest(".mobile-only")

  if (isMobileMenuOpen && !mobileMenu.contains(event.target) && !menuButton) {
    toggleMobileMenu()
  }
})

// Handle escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isAuthModalOpen) {
      closeAuthModal()
    }
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }
})

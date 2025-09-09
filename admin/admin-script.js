// Admin Panel JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeAdmin()
  loadDashboardStats()
  loadProducts()
  loadCategories()
})

// Initialize admin panel
function initializeAdmin() {
  // Navigation handling
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".content-section")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links and sections
      navLinks.forEach((l) => l.classList.remove("active"))
      sections.forEach((s) => s.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Show corresponding section
      const sectionId = this.dataset.section + "-section"
      const section = document.getElementById(sectionId)
      if (section) {
        section.classList.add("active")
        document.getElementById("page-title").textContent =
          this.textContent.charAt(0).toUpperCase() + this.textContent.slice(1)
      }
    })
  })

  // Form submissions
  document.getElementById("product-form").addEventListener("submit", handleProductSubmit)
  document.getElementById("category-form").addEventListener("submit", handleCategorySubmit)
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const response = await fetch("../api/admin-stats.php")
    const data = await response.json()

    if (data.success) {
      document.getElementById("total-products").textContent = data.data.products || 0
      document.getElementById("total-orders").textContent = data.data.orders || 0
      document.getElementById("total-customers").textContent = data.data.customers || 0
      document.getElementById("total-revenue").textContent = "$" + (data.data.revenue || 0)
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
  }
}

// Load products
async function loadProducts() {
  try {
    const response = await fetch("../api/admin-products.php")
    const data = await response.json()

    if (data.success) {
      displayProducts(data.data)
    }
  } catch (error) {
    console.error("Error loading products:", error)
  }
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById("products-tbody")
  tbody.innerHTML = ""

  products.forEach((product) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image_url || "/placeholder.svg?height=50&width=50"}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category_name || "N/A"}</td>
            <td>$${Number.parseFloat(product.price).toFixed(2)}</td>
            <td>${product.stock_quantity}</td>
            <td><span class="status-badge ${product.is_active ? "status-active" : "status-inactive"}">${product.is_active ? "Active" : "Inactive"}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Load categories
async function loadCategories() {
  try {
    const response = await fetch("../api/admin-categories.php")
    const data = await response.json()

    if (data.success) {
      displayCategories(data.data)
      populateCategorySelect(data.data)
    }
  } catch (error) {
    console.error("Error loading categories:", error)
  }
}

// Display categories in table
function displayCategories(categories) {
  const tbody = document.getElementById("categories-tbody")
  tbody.innerHTML = ""

  categories.forEach((category) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.slug}</td>
            <td>${category.product_count || 0}</td>
            <td>
                <button class="btn btn-secondary" onclick="editCategory(${category.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Populate category select dropdown
function populateCategorySelect(categories) {
  const select = document.getElementById("product-category")
  select.innerHTML = '<option value="">Select Category</option>'

  categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
  })
}

// Modal functions
function showAddProductModal() {
  document.getElementById("modal-title").textContent = "Add New Product"
  document.getElementById("product-form").reset()
  document.getElementById("product-id").value = ""
  document.getElementById("product-modal").style.display = "block"
}

function showAddCategoryModal() {
  document.getElementById("category-form").reset()
  document.getElementById("category-modal").style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Handle product form submission
async function handleProductSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const productId = document.getElementById("product-id").value

  try {
    const url = productId ? "../api/admin-products.php?action=update" : "../api/admin-products.php?action=create"
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      closeModal("product-modal")
      loadProducts()
      loadDashboardStats()
      alert("Product saved successfully!")
    } else {
      alert("Error: " + data.error)
    }
  } catch (error) {
    console.error("Error saving product:", error)
    alert("Error saving product")
  }
}

// Handle category form submission
async function handleCategorySubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)

  try {
    const response = await fetch("../api/admin-categories.php?action=create", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      closeModal("category-modal")
      loadCategories()
      alert("Category saved successfully!")
    } else {
      alert("Error: " + data.error)
    }
  } catch (error) {
    console.error("Error saving category:", error)
    alert("Error saving category")
  }
}

// Edit product
async function editProduct(id) {
  try {
    const response = await fetch(`../api/admin-products.php?id=${id}`)
    const data = await response.json()

    if (data.success) {
      const product = data.data

      document.getElementById("modal-title").textContent = "Edit Product"
      document.getElementById("product-id").value = product.id
      document.getElementById("product-name").value = product.name
      document.getElementById("product-description").value = product.description
      document.getElementById("product-price").value = product.price
      document.getElementById("product-original-price").value = product.original_price
      document.getElementById("product-category").value = product.category_id
      document.getElementById("product-stock").value = product.stock_quantity
      document.getElementById("product-featured").checked = product.is_featured

      document.getElementById("product-modal").style.display = "block"
    }
  } catch (error) {
    console.error("Error loading product:", error)
  }
}

// Delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`../api/admin-products.php?action=delete&id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        loadProducts()
        loadDashboardStats()
        alert("Product deleted successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }
}

// Delete category
async function deleteCategory(id) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      const response = await fetch(`../api/admin-categories.php?action=delete&id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        loadCategories()
        alert("Category deleted successfully!")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error deleting category")
    }
  }
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}

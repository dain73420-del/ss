export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  stock: number
  sku?: string
  weight?: number
  dimensions?: string
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  features: string[]
  images: string[]
  createdAt: string
  updatedAt: string
}

// In-memory data store (in production, this would be replaced with database calls)
const products: Product[] = [
  {
    id: 1,
    name: "প্রিমিয়াম ওয়্যারলেস হেডফোন",
    description: "উচ্চ মানের সাউন্ড এবং দীর্ঘস্থায়ী ব্যাটারি সহ প্রিমিয়াম ওয়্যারলেস হেডফোন। নয়েজ ক্যান্সেলেশন এবং কমফোর্টেবল ডিজাইন।",
    price: 299.99,
    originalPrice: 399.99,
    category: "ইলেকট্রনিক্স",
    brand: "TechPro",
    stock: 15,
    sku: "TWH-001",
    weight: 0.3,
    dimensions: "20 x 18 x 8 cm",
    isActive: true,
    isFeatured: true,
    tags: ["wireless", "premium", "noise-cancelling"],
    features: ["40mm ড্রাইভার", "30 ঘন্টা ব্যাটারি লাইফ", "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন", "ব্লুটুথ 5.0", "ফাস্ট চার্জিং"],
    images: ["/premium-wireless-headphones.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "গেমিং মেকানিক্যাল কীবোর্ড",
    description: "প্রফেশনাল গেমারদের জন্য RGB ব্যাকলাইট সহ মেকানিক্যাল কীবোর্ড। ব্লু সুইচ এবং অ্যান্টি-গোস্টিং ফিচার।",
    price: 149.99,
    originalPrice: 199.99,
    category: "ইলেকট্রনিক্স",
    brand: "GameMaster",
    stock: 8,
    sku: "GMK-002",
    weight: 1.2,
    dimensions: "44 x 13 x 4 cm",
    isActive: true,
    isFeatured: false,
    tags: ["gaming", "mechanical", "rgb"],
    features: ["মেকানিক্যাল ব্লু সুইচ", "RGB ব্যাকলাইট", "অ্যান্টি-গোস্টিং", "USB-C কানেকশন", "প্রোগ্রামেবল কী"],
    images: ["/gaming-mechanical-keyboard.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "ওয়্যারলেস মাউস",
    description: "এরগনমিক ডিজাইন সহ উচ্চ নির্ভুলতার ওয়্যারলেস মাউস। গেমিং এবং অফিস কাজের জন্য উপযুক্ত।",
    price: 79.99,
    category: "ইলেকট্রনিক্স",
    brand: "TechPro",
    stock: 0,
    sku: "TWM-003",
    weight: 0.1,
    dimensions: "12 x 6 x 4 cm",
    isActive: false,
    isFeatured: false,
    tags: ["wireless", "ergonomic", "gaming"],
    features: ["2400 DPI সেন্সর", "এরগনমিক ডিজাইন", "6 মাস ব্যাটারি লাইফ", "প্লাগ অ্যান্ড প্লে", "সাইলেন্ট ক্লিক"],
    images: ["/wireless-mouse.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "স্মার্ট ফিটনেস ট্র্যাকার",
    description: "হার্ট রেট মনিটরিং, স্লিপ ট্র্যাকিং এবং ওয়াটারপ্রুফ ডিজাইন সহ স্মার্ট ফিটনেস ব্যান্ড।",
    price: 89.99,
    originalPrice: 129.99,
    category: "ইলেকট্রনিক্স",
    brand: "FitTech",
    stock: 25,
    sku: "SFT-004",
    weight: 0.05,
    dimensions: "24 x 2 x 1 cm",
    isActive: true,
    isFeatured: true,
    tags: ["fitness", "smartwatch", "waterproof"],
    features: ["হার্ট রেট মনিটর", "স্লিপ ট্র্যাকিং", "IP68 ওয়াটারপ্রুফ", "7 দিন ব্যাটারি", "স্মার্ট নোটিফিকেশন"],
    images: ["/fitness-tracker-lifestyle.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "পোর্টেবল ব্লুটুথ স্পিকার",
    description: "360° সাউন্ড এবং ওয়াটারপ্রুফ ডিজাইন সহ পোর্টেবল ব্লুটুথ স্পিকার। আউটডোর এবং ইনডোর ব্যবহারের জন্য।",
    price: 59.99,
    originalPrice: 89.99,
    category: "ইলেকট্রনিক্স",
    brand: "SoundWave",
    stock: 12,
    sku: "PBS-005",
    weight: 0.6,
    dimensions: "18 x 7 x 7 cm",
    isActive: true,
    isFeatured: false,
    tags: ["bluetooth", "portable", "waterproof"],
    features: ["360° সাউন্ড", "12 ঘন্টা প্লেটাইম", "IPX7 ওয়াটারপ্রুফ", "ব্লুটুথ 5.0", "বিল্ট-ইন মাইক"],
    images: ["/bluetooth-speaker.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "ওয়্যারলেস চার্জিং প্যাড",
    description: "ফাস্ট চার্জিং সাপোর্ট সহ ইউনিভার্সাল ওয়্যারলেস চার্জিং প্যাড। সব Qi-enabled ডিভাইসের সাথে কম্প্যাটিবল।",
    price: 39.99,
    category: "ইলেকট্রনিক্স",
    brand: "ChargeTech",
    stock: 30,
    sku: "WCP-006",
    weight: 0.2,
    dimensions: "10 x 10 x 1 cm",
    isActive: true,
    isFeatured: false,
    tags: ["wireless", "charging", "fast-charge"],
    features: ["15W ফাস্ট চার্জিং", "Qi সার্টিফাইড", "LED ইন্ডিকেটর", "ওভারহিট প্রোটেকশন", "নন-স্লিপ বেস"],
    images: ["/wireless-charging-pad.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextId = 7

// Product management functions
export const getAllProducts = (): Product[] => {
  return products
}

export const getActiveProducts = (): Product[] => {
  return products.filter((product) => product.isActive)
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.isFeatured && product.isActive)
}

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const createProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const newProduct: Product = {
    ...productData,
    id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  products.push(newProduct)
  return newProduct
}

export const updateProduct = (id: number, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null => {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return products[index]
}

export const deleteProduct = (id: number): boolean => {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.isActive &&
      (product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))),
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, createProduct } from "@/lib/data/products"

export async function GET() {
  try {
    const products = getAllProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
    }

    // Create the product
    const newProduct = createProduct({
      name: productData.name,
      description: productData.description || "",
      price: Number.parseFloat(productData.price),
      originalPrice: productData.originalPrice ? Number.parseFloat(productData.originalPrice) : undefined,
      category: productData.category,
      brand: productData.brand || "",
      stock: Number.parseInt(productData.stock) || 0,
      sku: productData.sku || "",
      weight: productData.weight ? Number.parseFloat(productData.weight) : undefined,
      dimensions: productData.dimensions || "",
      isActive: productData.isActive !== false,
      isFeatured: productData.isFeatured === true,
      tags: productData.tags ? productData.tags.split(",").map((tag: string) => tag.trim()) : [],
      features: productData.features || [],
      images: productData.images || [],
    })

    return NextResponse.json({
      message: "Product created successfully",
      product: newProduct,
    })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

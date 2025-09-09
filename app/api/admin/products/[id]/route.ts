import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/data/products"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const product = getProductById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updates = await request.json()

    // Process the updates
    const processedUpdates: any = {}

    if (updates.name) processedUpdates.name = updates.name
    if (updates.description) processedUpdates.description = updates.description
    if (updates.price) processedUpdates.price = Number.parseFloat(updates.price)
    if (updates.originalPrice) processedUpdates.originalPrice = Number.parseFloat(updates.originalPrice)
    if (updates.category) processedUpdates.category = updates.category
    if (updates.brand) processedUpdates.brand = updates.brand
    if (updates.stock !== undefined) processedUpdates.stock = Number.parseInt(updates.stock)
    if (updates.sku) processedUpdates.sku = updates.sku
    if (updates.weight) processedUpdates.weight = Number.parseFloat(updates.weight)
    if (updates.dimensions) processedUpdates.dimensions = updates.dimensions
    if (updates.isActive !== undefined) processedUpdates.isActive = updates.isActive
    if (updates.isFeatured !== undefined) processedUpdates.isFeatured = updates.isFeatured
    if (updates.tags) processedUpdates.tags = updates.tags.split(",").map((tag: string) => tag.trim())
    if (updates.features) processedUpdates.features = updates.features
    if (updates.images) processedUpdates.images = updates.images

    const updatedProduct = updateProduct(id, processedUpdates)

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = deleteProduct(id)

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

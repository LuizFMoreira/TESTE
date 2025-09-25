import { createClient } from "./server"
import { createClient as createBrowserClient } from "./client"
import type { ProductWithSizes } from "./types"

// Buscar todos os produtos
export async function getAllProducts(): Promise<ProductWithSizes[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }

  return products || []
}

// Versão client-side para buscar todos os produtos
export async function getAllProductsClient(): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }

  return products || []
}

// Buscar produto por ID
export async function getProductById(id: string): Promise<ProductWithSizes | null> {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erro ao buscar produto:", error)
    return null
  }

  return product
}

// Buscar produto por SKU (para compatibilidade com código existente)
export async function getProductBySku(sku: string): Promise<ProductWithSizes | null> {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("sku", sku)
    .single()

  if (error) {
    console.error("Erro ao buscar produto por SKU:", error)
    return null
  }

  return product
}

// Buscar produtos por categoria
export async function getProductsByCategory(category: string): Promise<ProductWithSizes[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }

  return products || []
}

// Versão client-side para buscar produtos por categoria
export async function getProductsByCategoryClient(category: string): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }

  return products || []
}

// Buscar produtos em promoção
export async function getProductsOnSale(): Promise<ProductWithSizes[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .eq("is_on_sale", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar produtos em promoção:", error)
    return []
  }

  return products || []
}

// Buscar produtos por termo de pesquisa
export async function searchProducts(searchTerm: string): Promise<ProductWithSizes[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao pesquisar produtos:", error)
    return []
  }

  return products || []
}

// Versão client-side para pesquisar produtos
export async function searchProductsClient(searchTerm: string): Promise<ProductWithSizes[]> {
  const supabase = createBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_sizes (*)
    `)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao pesquisar produtos:", error)
    return []
  }

  return products || []
}

// Calcular estoque total de um produto
export function getTotalStock(product: ProductWithSizes): number {
  if (product.product_sizes && product.product_sizes.length > 0) {
    return product.product_sizes.reduce((total, size) => total + size.stock, 0)
  }
  return product.stock
}

// Obter estoque disponível para um tamanho específico
export function getStockForSize(product: ProductWithSizes, size: string): number {
  if (!product.product_sizes || product.product_sizes.length === 0) {
    return product.stock
  }

  const sizeData = product.product_sizes.find((s) => s.size === size)
  return sizeData?.stock || 0
}

// Verificar se produto tem tamanhos
export function hasProductSizes(product: ProductWithSizes): boolean {
  return product.product_sizes && product.product_sizes.length > 0
}

// Obter categorias únicas
export async function getCategories(): Promise<string[]> {
  const supabase = await createClient()

  const { data: categories, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }

  // Remover duplicatas
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])]
  return uniqueCategories
}

// Versão client-side para obter categorias únicas
export async function getCategoriesClient(): Promise<string[]> {
  const supabase = createBrowserClient()

  const { data: categories, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }

  // Remover duplicatas
  const uniqueCategories = [...new Set(categories?.map((c) => c.category) || [])]
  return uniqueCategories
}

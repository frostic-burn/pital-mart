"use server"

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

// Cache for storing fetched data
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Log credentials for debugging (remove in production)
console.log("Shopify Domain:", domain)
console.log("Storefront Token:", storefrontAccessToken ? "Present" : "Missing")

async function shopifyFetch({
  query,
  variables,
  headers,
  cache: requestCache = "force-cache",
}: {
  query: string
  variables?: any
  headers?: HeadersInit
  cache?: RequestCache
}) {
  if (!domain || !storefrontAccessToken) {
    console.error("Missing Shopify credentials")
    throw new Error("Shopify credentials not configured")
  }

  const endpoint = `https://${domain}/api/2023-07/graphql.json`

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    cache: requestCache,
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  }

  try {
    const response = await fetch(endpoint, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Shopify API Error: ${response.status} - ${errorText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const body = await response.json()

    if (body.errors) {
      console.error("Shopify GraphQL Errors:", body.errors)
      throw new Error(body.errors[0].message)
    }

    return {
      status: response.status,
      body,
    }
  } catch (error) {
    console.error("Shopify fetch error:", error)
    throw error
  }
}

// GraphQL Queries - Updated to get proper inventory information
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                priceV2 {
                  amount
                  currencyCode
                }
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          availableForSale
          totalInventory
          tags
          productType
          vendor
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`

const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            priceV2 {
              amount
              currencyCode
            }
            compareAtPriceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      availableForSale
      totalInventory
      tags
      productType
      vendor
      createdAt
      updatedAt
    }
  }
`

function removeEdgesAndNodes(array: any): any[] {
  if (!array?.edges) return []
  return array.edges.map((edge: any) => edge?.node).filter(Boolean)
}

function reshapeProduct(product: any, filterHiddenProducts = true) {
  if (!product || (filterHiddenProducts && product.tags?.includes("nextjs-frontend-hidden"))) {
    return undefined
  }

  const { images, variants, ...rest } = product

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
  }
}

function reshapeProducts(products: any[]): any[] {
  const reshapedProducts = []

  for (const product of products) {
    const reshapedProduct = reshapeProduct(product)
    if (reshapedProduct) {
      reshapedProducts.push(reshapedProduct)
    }
  }

  return reshapedProducts
}

function reshapeCollection(collection: any) {
  if (!collection) {
    return undefined
  }

  return {
    ...collection,
    products: collection.products ? removeEdgesAndNodes(collection.products) : [],
  }
}

function reshapeCollections(collections: any[]): any[] {
  const reshapedCollections = []

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection)
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection)
      }
    }
  }

  return reshapedCollections
}

// Mock data functions for instant loading
function getMockProducts() {
  return {
    edges: [
      {
        node: {
          id: "gid://shopify/Product/1",
          title: "Traditional Brass Tawa",
          handle: "traditional-brass-tawa",
          description:
            "Handcrafted brass tawa perfect for making rotis and parathas. Made from pure brass for healthy cooking.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
              altText: "Traditional Brass Tawa",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "1299.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "1299.00",
              currencyCode: "INR",
            },
          },
          compareAtPriceRange: {
            minVariantPrice: {
              amount: "1599.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/1",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 10,
              priceV2: {
                amount: "1299.00",
                currencyCode: "INR",
              },
              compareAtPriceV2: {
                amount: "1599.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 10,
          tags: ["brass", "cookware", "traditional"],
          productType: "Cookware",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      {
        node: {
          id: "gid://shopify/Product/2",
          title: "Brass Water Bottle",
          handle: "brass-water-bottle",
          description:
            "Pure brass water bottle for healthy hydration. Keeps water naturally cool and adds essential minerals.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
              altText: "Brass Water Bottle",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "899.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "899.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/2",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 15,
              priceV2: {
                amount: "899.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 15,
          tags: ["brass", "water-bottle", "health"],
          productType: "Drinkware",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      {
        node: {
          id: "gid://shopify/Product/3",
          title: "Brass Kadai Set",
          handle: "brass-kadai-set",
          description: "Complete set of brass kadais in different sizes. Perfect for deep frying and cooking curries.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
              altText: "Brass Kadai Set",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "2499.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "2499.00",
              currencyCode: "INR",
            },
          },
          compareAtPriceRange: {
            minVariantPrice: {
              amount: "2999.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/3",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 8,
              priceV2: {
                amount: "2499.00",
                currencyCode: "INR",
              },
              compareAtPriceV2: {
                amount: "2999.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 8,
          tags: ["brass", "kadai", "cookware", "set"],
          productType: "Cookware",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      {
        node: {
          id: "gid://shopify/Product/4",
          title: "Brass Thali Set",
          handle: "brass-thali-set",
          description:
            "Traditional brass thali set with bowls and plates. Perfect for authentic Indian dining experience.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
              altText: "Brass Thali Set",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "1899.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "1899.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/4",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 12,
              priceV2: {
                amount: "1899.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 12,
          tags: ["brass", "thali", "dining", "traditional"],
          productType: "Dinnerware",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      {
        node: {
          id: "gid://shopify/Product/5",
          title: "Brass Lota (Water Pot)",
          handle: "brass-lota-water-pot",
          description: "Traditional brass lota for storing and serving water. Handcrafted with intricate designs.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
              altText: "Brass Lota Water Pot",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "699.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "699.00",
              currencyCode: "INR",
            },
          },
          compareAtPriceRange: {
            minVariantPrice: {
              amount: "899.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/5",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 20,
              priceV2: {
                amount: "699.00",
                currencyCode: "INR",
              },
              compareAtPriceV2: {
                amount: "899.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 20,
          tags: ["brass", "lota", "water-pot", "traditional"],
          productType: "Drinkware",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
      {
        node: {
          id: "gid://shopify/Product/6",
          title: "Brass Diya Set",
          handle: "brass-diya-set",
          description:
            "Set of traditional brass diyas for festivals and daily prayers. Brings positive energy to your home.",
          images: [
            {
              url: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
              altText: "Brass Diya Set",
            },
          ],
          priceRange: {
            minVariantPrice: {
              amount: "499.00",
              currencyCode: "INR",
            },
            maxVariantPrice: {
              amount: "499.00",
              currencyCode: "INR",
            },
          },
          variants: [
            {
              id: "gid://shopify/ProductVariant/6",
              title: "Default Title",
              availableForSale: true,
              quantityAvailable: 25,
              priceV2: {
                amount: "499.00",
                currencyCode: "INR",
              },
              selectedOptions: [],
            },
          ],
          availableForSale: true,
          totalInventory: 25,
          tags: ["brass", "diya", "festival", "spiritual"],
          productType: "Decorative",
          vendor: "PitalMart",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }
}

function getMockCollections() {
  return [
    {
      id: "gid://shopify/Collection/1",
      title: "Cookware",
      handle: "cookware",
      description: "Traditional brass cookware for healthy cooking",
      image: {
        url: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
        altText: "Cookware Collection",
      },
      products: [],
    },
    {
      id: "gid://shopify/Collection/2",
      title: "Drinkware",
      handle: "drinkware",
      description: "Brass bottles and glasses for healthy hydration",
      image: {
        url: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
        altText: "Drinkware Collection",
      },
      products: [],
    },
    {
      id: "gid://shopify/Collection/3",
      title: "Dinnerware",
      handle: "dinnerware",
      description: "Traditional brass plates and thalis",
      image: {
        url: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
        altText: "Dinnerware Collection",
      },
      products: [],
    },
    {
      id: "gid://shopify/Collection/4",
      title: "Decorative",
      handle: "decorative",
      description: "Beautiful brass decorative items for your home",
      image: {
        url: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
        altText: "Decorative Collection",
      },
      products: [],
    },
  ]
}

function getMockProductByHandle(handle: string) {
  const mockProducts = getMockProducts().edges.map((edge) => edge.node)
  return mockProducts.find((product) => product.handle === handle) || mockProducts[0]
}

// Cached server actions with instant fallback
export async function getShopifyProducts(first = 20, after?: string) {
  const cacheKey = `products-${first}-${after || "initial"}`

  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  try {
    const { body } = await shopifyFetch({
      query: GET_PRODUCTS_QUERY,
      variables: { first, after },
      cache: "force-cache",
    })

    const products = reshapeProducts(removeEdgesAndNodes(body.data.products))
    const result = {
      edges: products.map((product: any) => ({ node: product })),
      pageInfo: body.data.products.pageInfo,
    }

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    return result
  } catch (error) {
    console.error("Error fetching products from Shopify:", error)
    // Return mock data immediately on error
    return getMockProducts()
  }
}

export async function getShopifyCollections(first = 20) {
  const cacheKey = `collections-${first}`

  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  try {
    const { body } = await shopifyFetch({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
      cache: "force-cache",
    })

    const result = reshapeCollections(removeEdgesAndNodes(body.data.collections))

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    return result
  } catch (error) {
    console.error("Error fetching collections from Shopify:", error)
    // Return mock data immediately on error
    return getMockCollections()
  }
}

export async function getShopifyProductByHandle(handle: string) {
  const cacheKey = `product-${handle}`

  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  try {
    const { body } = await shopifyFetch({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      cache: "force-cache",
    })

    const product = reshapeProduct(body.data.productByHandle)

    // Cache the result
    if (product) {
      cache.set(cacheKey, {
        data: product,
        timestamp: Date.now(),
      })
    }

    return product || null
  } catch (error) {
    console.error("Error fetching product by handle from Shopify:", error)
    // Return mock data immediately on error
    return getMockProductByHandle(handle)
  }
}

// Cart mutations
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                product {
                  id
                  title
                  handle
                  featuredImage {
                    url
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function createCart() {
  try {
    const { body } = await shopifyFetch({
      query: CART_CREATE_MUTATION,
      variables: { input: {} },
    })

    if (body.data.cartCreate.userErrors.length > 0) {
      throw new Error(body.data.cartCreate.userErrors[0].message)
    }

    return body.data.cartCreate.cart
  } catch (error) {
    console.error("Error creating cart:", error)
    throw error
  }
}

export async function getCart(cartId: string) {
  try {
    const { body } = await shopifyFetch({
      query: GET_CART_QUERY,
      variables: { cartId },
    })
    return body.data.cart
  } catch (error) {
    console.error("Error getting cart:", error)
    return null
  }
}

export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  try {
    const { body } = await shopifyFetch({
      query: CART_LINES_ADD_MUTATION,
      variables: { cartId, lines },
    })

    if (body.data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(body.data.cartLinesAdd.userErrors[0].message)
    }

    return body.data.cartLinesAdd.cart
  } catch (error) {
    console.error("Error adding cart lines:", error)
    throw error
  }
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  // Implementation for updating cart lines
  return null
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  // Implementation for removing cart lines
  return null
}

import { type NextRequest, NextResponse } from "next/server"

const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!

async function shopifyAdminFetch(query: string, variables?: any) {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  if (data.errors) {
    throw new Error(data.errors[0].message)
  }

  return data.data
}

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()

    if (!token || !email) {
      return NextResponse.json({ error: "Token and email are required" }, { status: 400 })
    }

    // Find customer by email
    const customerQuery = `
      query getCustomer($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              tags
              state
            }
          }
        }
      }
    `

    const data = await shopifyAdminFetch(customerQuery, { email })

    if (data.customers.edges.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = data.customers.edges[0].node

    // Check if customer has pending verification tag
    if (!customer.tags.includes("pending-verification")) {
      return NextResponse.json({ error: "Customer is already verified or verification not required" }, { status: 400 })
    }

    // Update customer tags to mark as email verified
    const updateQuery = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const updatedTags = customer.tags.filter((tag: string) => tag !== "pending-verification")
    updatedTags.push("email-verified")

    const updateData = await shopifyAdminFetch(updateQuery, {
      input: {
        id: customer.id,
        tags: updatedTags,
      },
    })

    if (updateData.customerUpdate.userErrors.length > 0) {
      return NextResponse.json({ error: updateData.customerUpdate.userErrors[0].message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      customerId: customer.id,
    })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}

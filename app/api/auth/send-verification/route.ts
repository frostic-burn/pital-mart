import { type NextRequest, NextResponse } from "next/server"

const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

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
    const { email, firstName, lastName } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Email, first name, and last name are required" }, { status: 400 })
    }

    // Check if customer already exists
    const existingCustomerQuery = `
      query getCustomer($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              tags
            }
          }
        }
      }
    `

    const existingData = await shopifyAdminFetch(existingCustomerQuery, { email })

    if (existingData.customers.edges.length > 0) {
      const customer = existingData.customers.edges[0].node

      // If customer exists but hasn't completed registration, resend invitation
      if (customer.tags.includes("pending-verification")) {
        // Send customer invitation email
        const inviteQuery = `
          mutation customerInvite($customerId: ID!) {
            customerInvite(customerId: $customerId) {
              customer {
                id
                email
              }
              userErrors {
                field
                message
              }
            }
          }
        `

        await shopifyAdminFetch(inviteQuery, { customerId: customer.id })

        return NextResponse.json({
          success: true,
          message: "Verification email resent successfully",
        })
      } else {
        return NextResponse.json({ error: "Customer already exists and is verified" }, { status: 400 })
      }
    }

    // Create new customer with pending verification tag
    const createCustomerQuery = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const customerInput = {
      email,
      firstName,
      lastName,
      tags: ["pending-verification"],
      acceptsMarketing: false,
    }

    const createData = await shopifyAdminFetch(createCustomerQuery, { input: customerInput })

    if (createData.customerCreate.userErrors.length > 0) {
      return NextResponse.json({ error: createData.customerCreate.userErrors[0].message }, { status: 400 })
    }

    const customerId = createData.customerCreate.customer.id

    // Send customer invitation email
    const inviteQuery = `
      mutation customerInvite($customerId: ID!) {
        customerInvite(customerId: $customerId) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const inviteData = await shopifyAdminFetch(inviteQuery, { customerId })

    if (inviteData.customerInvite.userErrors.length > 0) {
      return NextResponse.json({ error: inviteData.customerInvite.userErrors[0].message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
      customerId,
    })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}

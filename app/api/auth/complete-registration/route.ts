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
    const { email, phone, address } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
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
              addresses {
                id
              }
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

    // Check if customer has email-verified tag
    if (!customer.tags.includes("email-verified")) {
      return NextResponse.json({ error: "Email must be verified before completing registration" }, { status: 400 })
    }

    // Update customer with phone and complete registration
    const updateQuery = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
            phone
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const updatedTags = customer.tags.filter((tag: string) => tag !== "email-verified")
    updatedTags.push("registration-complete")

    const customerInput: any = {
      id: customer.id,
      tags: updatedTags,
    }

    if (phone) {
      customerInput.phone = phone
    }

    const updateData = await shopifyAdminFetch(updateQuery, { input: customerInput })

    if (updateData.customerUpdate.userErrors.length > 0) {
      return NextResponse.json({ error: updateData.customerUpdate.userErrors[0].message }, { status: 400 })
    }

    // Add address if provided
    if (address && address.address1) {
      const addressQuery = `
        mutation customerAddressCreate($customerId: ID!, $address: MailingAddressInput!) {
          customerAddressCreate(customerId: $customerId, address: $address) {
            customerAddress {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `

      const addressInput = {
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        province: address.state,
        country: address.country || "India",
        zip: address.zipCode,
        firstName: address.firstName || "",
        lastName: address.lastName || "",
      }

      await shopifyAdminFetch(addressQuery, {
        customerId: customer.id,
        address: addressInput,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully",
      customer: updateData.customerUpdate.customer,
    })
  } catch (error) {
    console.error("Error completing registration:", error)
    return NextResponse.json({ error: "Failed to complete registration" }, { status: 500 })
  }
}

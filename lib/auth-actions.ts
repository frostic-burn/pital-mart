"use server"

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!

const shopifyFetch = async (query: string, variables?: any) => {
  const endpoint = `https://${domain}/api/2023-07/graphql.json`

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
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

// Customer Access Token queries
const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`

const GET_CUSTOMER = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      updatedAt
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
      defaultAddress {
        id
      }
    }
  }
`

const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_ADDRESS_DELETE = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_DEFAULT_ADDRESS_UPDATE = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

export async function createCustomerAccessToken(email: string, password: string) {
  const data = await shopifyFetch(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  })

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message)
  }

  return data.customerAccessTokenCreate.customerAccessToken
}

export async function deleteCustomerAccessToken(customerAccessToken: string) {
  return await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken })
}

export async function getCustomer(customerAccessToken: string) {
  const data = await shopifyFetch(GET_CUSTOMER, { customerAccessToken })
  return data.customer
}

export async function createCustomer(input: any) {
  const data = await shopifyFetch(CUSTOMER_CREATE, { input })

  if (data.customerCreate.customerUserErrors.length > 0) {
    throw new Error(data.customerCreate.customerUserErrors[0].message)
  }

  return data.customerCreate.customer
}

export async function updateCustomer(customerAccessToken: string, customer: any) {
  const data = await shopifyFetch(CUSTOMER_UPDATE, { customerAccessToken, customer })

  if (data.customerUpdate.customerUserErrors.length > 0) {
    throw new Error(data.customerUpdate.customerUserErrors[0].message)
  }

  return data.customerUpdate.customer
}

export async function createCustomerAddress(customerAccessToken: string, address: any) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_CREATE, { customerAccessToken, address })

  if (data.customerAddressCreate.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressCreate.customerUserErrors[0].message)
  }

  return data.customerAddressCreate.customerAddress
}

export async function updateCustomerAddress(customerAccessToken: string, id: string, address: any) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_UPDATE, { customerAccessToken, id, address })

  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressUpdate.customerUserErrors[0].message)
  }

  return data.customerAddressUpdate.customerAddress
}

export async function deleteCustomerAddress(customerAccessToken: string, id: string) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_DELETE, { customerAccessToken, id })

  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    throw new Error(data.customerAddressDelete.customerUserErrors[0].message)
  }

  return data.customerAddressDelete.deletedCustomerAddressId
}

export async function updateDefaultAddress(customerAccessToken: string, addressId: string) {
  const data = await shopifyFetch(CUSTOMER_DEFAULT_ADDRESS_UPDATE, { customerAccessToken, addressId })

  if (data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
    throw new Error(data.customerDefaultAddressUpdate.customerUserErrors[0].message)
  }

  return data.customerDefaultAddressUpdate.customer
}

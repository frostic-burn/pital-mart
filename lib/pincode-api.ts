"use server"

interface PincodeData {
  pincode: string
  city: string
  state: string
  country: string
  district: string
}

export async function getPincodeData(
  pincode: string,
): Promise<{ success: boolean; data?: PincodeData; message?: string }> {
  try {
    if (!validateIndianPincode(pincode)) {
      return { success: false, message: "Invalid pincode format" }
    }

    // Using India Post API for pincode lookup
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const data = await response.json()

    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const postOffice = data[0].PostOffice[0]

      return {
        success: true,
        data: {
          pincode,
          city: postOffice.District,
          state: postOffice.State,
          country: "India",
          district: postOffice.District,
        },
      }
    }

    return { success: false, message: "Pincode not found" }
  } catch (error) {
    console.error("Error fetching pincode data:", error)
    return { success: false, message: "Failed to fetch pincode data" }
  }
}

export function validateIndianPincode(pincode: string): boolean {
  // Indian pincode format: 6 digits
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

export function validateIndianPhone(phone: string): boolean {
  // Indian mobile number format: 10 digits starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/
  const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")

  // Handle +91 prefix
  if (cleanPhone.startsWith("+91")) {
    return phoneRegex.test(cleanPhone.slice(3))
  }

  // Handle 91 prefix
  if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
    return phoneRegex.test(cleanPhone.slice(2))
  }

  return phoneRegex.test(cleanPhone)
}

export function formatIndianPhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")

  // Handle +91 prefix
  if (cleanPhone.startsWith("+91")) {
    return cleanPhone
  }

  // Handle 91 prefix
  if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
    return `+${cleanPhone}`
  }

  // Add +91 prefix if it's a 10-digit number
  if (cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone)) {
    return `+91${cleanPhone}`
  }

  return phone
}

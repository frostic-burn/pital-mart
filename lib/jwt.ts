import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-development")

export async function signToken(payload: any, expiresIn = "30d"): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error("Error signing JWT:", error)
    throw new Error("Failed to sign token")
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("Error verifying JWT:", error)
    throw new Error("Invalid token")
  }
}

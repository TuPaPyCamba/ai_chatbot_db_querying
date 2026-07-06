/**
 * Simple simulator for session token generation and verification.
 */
export function generateSessionToken(payload: { email: string; name: string }): string {
  const data = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiry
  };
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function verifySessionToken(token: string): { email: string; name: string } | null {
  try {
    if (!token) return null;
    const decodedStr = Buffer.from(token, "base64").toString("utf-8");
    const data = JSON.parse(decodedStr);
    
    if (data.exp < Date.now()) {
      return null; // Expired
    }
    
    return {
      email: data.email,
      name: data.name,
    };
  } catch {
    return null; // Invalid token format
  }
}

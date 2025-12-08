import axios from "axios";
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const url = "https://oauth2.googleapis.com/token";

  const body = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  try {
    const response = await axios.post(url, body, {
      headers: { 
        "Content-Type": "application/json" 
      }
    });

    if (!response.data.access_token) {
      throw new Error("No access token in response");
    }

    return response.data.access_token as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to refresh token:", error.response?.data);
      throw new Error(`Token refresh failed: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

export default refreshAccessToken;
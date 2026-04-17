
"use server"


import { httpClient } from "@/lib/axios/httpClient";
import jwt from "jsonwebtoken";



//user purchase info

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getPurchaseInfo(mediaId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    
    if (!accessToken) {
        return null;
    }

    const res = await httpClient.get(`${BASE_API_URL}/payment/getPurchase/${mediaId}`, {
      headers: {
       Authorization: `Bearer ${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    
    return res.data;
  } catch (error: any) {
    console.error("Fetch Purchase Error:", error.response?.data || error.message);
    return null;
  }
}



//get subscription info


export async function getSubscriptionInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    
    if (!accessToken) {
        return null;
    }

    // 🟢 Attach the token to the Authorization header
    const res = await httpClient.get(`${BASE_API_URL}/payment/getSubscription`, {
      headers: {
        Authorization: `Bearer ${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });
    
    return res.data;
  } catch (error: any) {
    // Better error logging to see exactly what the backend rejected
    console.error("Fetch Purchase Error:", error.response?.data || error.message);
    return null;
  }
}
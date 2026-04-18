"use server"
import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createComment(reviewId: string, content: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const res = await httpClient.post(
      `${BASE_API_URL}/comment/${reviewId}`,
      { content: content }, // 🟢 FIXED: Wrapped in the object your API expects
      {
        headers: {
          Authorization: `Bearer ${accessToken}; better-auth.session_token=${sessionToken}`,
        },
      },
    );
    
    // 🟢 FIXED: Return the data so the frontend mutation knows it worked
    return res.data; 
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return { success: false };
  }
}

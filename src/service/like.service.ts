"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";



const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const toggoleLike = async (commentId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const res = await httpClient.post(`${BASE_API_URL}/like/${commentId}`,{
         headers: {
          Authorization: `Bearer ${accessToken}; better-auth.session_token=${sessionToken}`,
        }
    });

    return {
        success: true,
        data : res.data
    }
  } catch (error: any) {
    console.log("error from liking the comment", error);
    return null;
  }
};

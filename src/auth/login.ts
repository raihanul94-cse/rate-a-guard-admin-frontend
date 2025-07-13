import axios from "axios";
import { setAccessToken } from "./auth-token";
import { apiClient } from "../api";
import { AxiosError } from "axios";
import { ILoginResponseData, ISuccessResponse } from "@/types/api";

const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/admin/auth/login`;

export async function login(
  emailAddress: string,
  password: string
): Promise<boolean> {
  try {
    const response = await axios.post<ISuccessResponse<ILoginResponseData>>(
      AUTH_URL,
      {
        emailAddress,
        password,
      }
    );

    const { authTokens } = response.data.data;

    setAccessToken(authTokens.access.token);

    apiClient.setToken(authTokens.access.token);

    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.log("Login failed:", err.response?.data || err.message);
    return false;
  }
}

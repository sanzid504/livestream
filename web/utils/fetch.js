import axios from "axios";

const API = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3005";
const headers = {};

export async function get(endpoint, params = {}, token = "", full = false) {
  try {
    const response = await axios.get(API + endpoint, {
      withCredentials: true,
      params: params || {},
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    // if(response?.data?.data?.auth) return window.location.href = `/auth/register?redirect=${window.location.pathname}`
    if (full) return response;
    return response.data;
  } catch (e) {
    return { status: "error", data: "Network Error" };
  }
}

export async function post(endpoint, data = {}, full = false) {
  try {
    const response = await axios.post(API + endpoint, data, {
      withCredentials: true,
      headers,
    });
    if (full) return response;
    return response.data;
  } catch (e) {
    console.log(e);
    return { status: "error", data: "Network Error" };
  }
}

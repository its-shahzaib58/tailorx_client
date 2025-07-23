// src/utils/auth.ts
import axios from "axios";

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// console.log(SERVER_DOMAIN)
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${SERVER_DOMAIN}/auth/me`,{
        withCredentials:true
      }
    );

    return response.data.loggedIn;
  } catch (error) {
    return false;
  }
};

  
import { apiRequest } from "@/utils/apiRequest";
import { getAuthToken } from "@/utils/getAuthToken";

export async function fetchBookings() {
  try {
    // const token = getAuthToken();
    // if (!token) {
    //   throw new Error("No authentication token found");
    // }

    const response = await apiRequest({
      url: "/api/read/bookings",
      method: "GET",
      token: getAuthToken(),
    });

    return response.data; // Returns bookings data
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

export async function fetchRefunds() {
  try {
    // const token = getAuthToken();
    // if (!token) {
    //   throw new Error("No authentication token found");
    // }

    const response = await apiRequest({
      url: "/api/read/refunds",
      method: "GET",
      token: getAuthToken(),
    });

    return response.data; // Returns refunds data
  } catch (error) {
    console.error("Error fetching refunds:", error);
    throw error;
  }
}
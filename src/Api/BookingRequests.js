import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:9999/bookings" })

export const checkHourAvailability = (data) => API.post("/check-hour-availability", data);
export const checkDayAvailability = (data) => API.post("/check-day-availability", data);
export const createBooking = (data) => API.post("/create", data);
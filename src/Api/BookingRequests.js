import axios from "axios";
import { Constants } from "../utils/constants";

const API = axios.create({ baseURL: `${Constants.apiHost}/bookings` })

export const checkHourAvailability = (data) => API.post("/check-hour-availability", data);
export const checkDayAvailability = (data) => API.post("/check-day-availability", data);
export const createBooking = (data) => API.post("/create", data);
import axios from "axios";
import { createFormHeaders, createHeaders, createHeaderWithoutToken } from "../utils";
import { BASE_URL, BASE_URL_two } from "../constants/Constant";

//verify mobile API
export const loginAPI = async (data, config) => {
  const headers = createHeaderWithoutToken();
  return await axios.post(`${BASE_URL}login`, data, headers);
};
export const ddEmployeeAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${BASE_URL}get-emp-list`, data, headers);
};
export const dashboardDataAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${BASE_URL}dashboard`, data, headers);
};
export const TodayAttendanceAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${BASE_URL}today-attendance`, data, headers);
};

export const RegisterEmployeeAPI = async (data, config) => {
  const headers = createFormHeaders();
  return await axios.post(`${BASE_URL_two}register`, data, headers);
};
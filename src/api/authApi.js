import axiosInstance from './axiosInstance'

export const loginUser = (credentials) => {
  return axiosInstance.post('/auth/login', credentials)
}

export const registerDonor = (data) => {
  return axiosInstance.post('/auth/register/donor', data)
}

export const registerNgo = (data) => {
  return axiosInstance.post('/auth/register/ngo', data)
}
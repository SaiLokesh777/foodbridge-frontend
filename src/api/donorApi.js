import axiosInstance from './axiosInstance'

export const getMyPosts = () => {
  return axiosInstance.get('/donor/food-listings')
}

export const postFood = (data) => {
  return axiosInstance.post('/donor/food-listings', data)
}
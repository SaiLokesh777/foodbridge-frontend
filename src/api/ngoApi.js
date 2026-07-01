import axiosInstance from './axiosInstance'

export const getAvailableListings = () => {
  return axiosInstance.get('/ngo/food-listings/available')
}

export const getMyPickups = () => {
  return axiosInstance.get('/ngo/food-listings/my-pickups')
}

export const acceptListing = (id) => {
  return axiosInstance.patch(`/ngo/food-listings/${id}/accept`)
}

export const collectListing = (id, data) => {
  return axiosInstance.patch(`/ngo/food-listings/${id}/collect`, data)
}
export const cancelListing = (id) => {
  return axiosInstance.patch(`/ngo/food-listings/${id}/cancel`)
}

export const deliverListing = (id, data) => {
  return axiosInstance.patch(`/ngo/food-listings/${id}/deliver`, data)
}
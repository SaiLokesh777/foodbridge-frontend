import axiosInstance from './axiosInstance'

export const getPendingNgos = () => {
  return axiosInstance.get('/admin/ngo/pending')
}

export const approveNgo = (id) => {
  return axiosInstance.patch(`/admin/ngo/${id}/approve`)
}

export const rejectNgo = (id) => {
  return axiosInstance.patch(`/admin/ngo/${id}/reject`)
}

export const getReportSummary = () => {
  return axiosInstance.get('/admin/reports/summary')
}

export const getAllListings = () => {
  return axiosInstance.get('/admin/food-listings')
}
export const getAllDonors = () => {
  return axiosInstance.get('/admin/donors')
}

export const getAllNgos = () => {
  return axiosInstance.get('/admin/ngos')
}
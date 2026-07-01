function StatusBadge({ status }) {
  const styles = {
    AVAILABLE: 'bg-amber-50 text-amber-800',
    ACCEPTED: 'bg-blue-50 text-blue-800',
    COLLECTED: 'bg-blue-50 text-blue-800',
    DELIVERED: 'bg-green-50 text-green-800',
    EXPIRED: 'bg-gray-100 text-gray-600',
  }

  const labels = {
    AVAILABLE: 'Available',
    ACCEPTED: 'Accepted',
    COLLECTED: 'Collected',
    DELIVERED: 'Delivered',
    EXPIRED: 'Expired',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  )
}

export default StatusBadge
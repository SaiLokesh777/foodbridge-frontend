import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableListings, getMyPickups, acceptListing } from '../api/ngoApi'
import { useAuth } from '../auth/AuthContext'
import StatusBadge from '../components/StatusBadge'

function NgoDashboard() {
  const [tab, setTab] = useState('available')
  const [available, setAvailable] = useState([])
  const [myPickups, setMyPickups] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [availableRes, pickupsRes] = await Promise.all([
        getAvailableListings(),
        getMyPickups(),
      ])
      setAvailable(availableRes.data)
      setMyPickups(pickupsRes.data)
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
    setActionError('')
    try {
      await acceptListing(id)
      loadData()
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to accept listing')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const timeLeft = (availableUntil) => {
    const diff = new Date(availableUntil) - new Date()
    if (diff <= 0) return 'Expired'
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`
  }

  const urgencyStyle = (availableUntil) => {
    const diff = new Date(availableUntil) - new Date()
    const mins = diff / 60000
    if (mins < 45) return 'bg-red-50 text-red-700'
    if (mins < 120) return 'bg-amber-50 text-amber-800'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
                <span className="text-white font-semibold text-sm">F</span>
              </div>
              <span className="font-medium text-gray-900 text-sm">Food Bridge</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Log out
            </button>
          </div>

          <div className="px-6 pt-5 pb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{user?.name}</p>
            <p className="text-xl font-medium text-gray-900">Nearby pickups</p>
          </div>

          <div className="flex gap-1 px-6 pb-0 border-b border-gray-100">
            <button
              onClick={() => setTab('available')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                tab === 'available'
                  ? 'text-brand border-brand'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              Available ({available.length})
            </button>
            <button
              onClick={() => setTab('mypickups')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab === 'mypickups'
                  ? 'text-brand border-brand'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              My pickups ({myPickups.length})
            </button>
          </div>

          <div className="p-6">
            {actionError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl mb-3">
                {actionError}
              </p>
            )}

            {loading && (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            )}

            {!loading && tab === 'available' && (
              <div className="space-y-3">
                {available.length === 0 && (
                  <div className="py-10 text-center bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700">Nothing available right now</p>
                    <p className="text-xs text-gray-400 mt-1">Check back soon — restaurants post throughout the day</p>
                  </div>
                )}
                {available.map((listing) => (
                  <div key={listing.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-base">🍱</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {listing.foodName}, {listing.quantity}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            📍 {listing.pickupAddress}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${urgencyStyle(listing.availableUntil)}`}>
                        {timeLeft(listing.availableUntil)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAccept(listing.id)}
                      className="w-full bg-brand text-white font-medium py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                    >
                      Accept pickup
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!loading && tab === 'mypickups' && (
              <div className="space-y-2">
                {myPickups.length === 0 && (
                  <div className="py-10 text-center bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-700">No pickups yet</p>
                    <p className="text-xs text-gray-400 mt-1">Accept an available listing to get started</p>
                  </div>
                )}
                {myPickups.slice().reverse().map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/ngo/pickup/${listing.id}`)}
                    className="border border-gray-100 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-base">🍱</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {listing.foodName}, {listing.quantity}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{listing.donor?.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={listing.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default NgoDashboard
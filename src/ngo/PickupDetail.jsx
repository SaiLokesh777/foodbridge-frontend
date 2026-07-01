import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMyPickups, collectListing, deliverListing, cancelListing } from '../api/ngoApi'
import StatusBadge from '../components/StatusBadge'
import ImageUploadInput from '../components/ImageUploadInput'

function PickupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const [collectedPhotoUrl, setCollectedPhotoUrl] = useState('')
  const [deliveredPhotoUrl, setDeliveredPhotoUrl] = useState('')
  const [beneficiaryType, setBeneficiaryType] = useState('ORPHANAGE')
  const [peopleFedCount, setPeopleFedCount] = useState('')

  useEffect(() => {
    loadListing()
  }, [])

  const loadListing = async () => {
    setLoading(true)
    try {
      const response = await getMyPickups()
      const found = response.data.find((l) => l.id === parseInt(id))
      setListing(found)
    } catch (err) {
      console.error('Failed to load pickup', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCollect = async (e) => {
    e.preventDefault()
    setError('')
    if (!collectedPhotoUrl) {
      setError('Please add a photo as proof of collection')
      return
    }
    setSubmitting(true)
    try {
      await collectListing(id, { collectedPhotoUrl })
      loadListing()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark as collected')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeliver = async (e) => {
    e.preventDefault()
    setError('')
    if (!deliveredPhotoUrl) {
      setError('Please add a photo as proof of delivery')
      return
    }
    if (!peopleFedCount) {
      setError('Please enter how many people were fed')
      return
    }
    setSubmitting(true)
    try {
      await deliverListing(id, {
        deliveredPhotoUrl,
        beneficiaryType,
        peopleFedCount: parseInt(peopleFedCount),
      })
      navigate('/ngo')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark as delivered')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async () => {
    const confirmed = window.confirm(
      'Release this pickup back to other NGOs? Only do this if you genuinely cannot collect the food.'
    )
    if (!confirmed) return
    setError('')
    setCancelling(true)
    try {
      await cancelListing(id)
      navigate('/ngo')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel this pickup')
    } finally {
      setCancelling(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Pickup not found</p>
          <button onClick={() => navigate('/ngo')} className="text-xs text-brand mt-2">
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate('/ngo')}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            <div>
              <p className="font-medium text-gray-900 text-sm">Pickup detail</p>
              <p className="text-xs text-gray-400 mt-0.5">Manage this food pickup</p>
            </div>
          </div>

          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🍱</span>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{listing.foodName}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{listing.quantity}</p>
                </div>
              </div>
              <StatusBadge status={listing.status} />
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Donor:</span> {listing.donor?.name}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Pickup:</span> {listing.pickupAddress}
              </p>
              {listing.notes && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Notes:</span> {listing.notes}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-5">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl mb-4">{error}</p>
            )}

            {listing.status === 'ACCEPTED' && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Mark as collected
                </p>
                <form onSubmit={handleCollect} className="space-y-4">
                  <ImageUploadInput value={collectedPhotoUrl} onChange={setCollectedPhotoUrl} />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
                  >
                    {submitting ? 'Saving...' : 'Mark as collected'}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full text-sm text-red-500 border border-red-100 bg-red-50 py-2.5 rounded-xl disabled:opacity-60 hover:bg-red-100 transition-colors"
                  >
                    {cancelling ? 'Releasing...' : "Can't make it? Release this pickup"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">
                    This returns the food to the available pool immediately
                  </p>
                </div>
              </>
            )}

            {listing.status === 'COLLECTED' && (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Mark as delivered
                </p>
                <form onSubmit={handleDeliver} className="space-y-4">
                  <ImageUploadInput value={deliveredPhotoUrl} onChange={setDeliveredPhotoUrl} />

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
                      Beneficiary type
                    </label>
                    <select
                      value={beneficiaryType}
                      onChange={(e) => setBeneficiaryType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="ORPHANAGE">Orphanage</option>
                      <option value="OLD_AGE_HOME">Old age home</option>
                      <option value="SHELTER">Shelter</option>
                      <option value="STREET_FEEDING">Street feeding</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
                      People fed
                    </label>
                    <input
                      type="number"
                      value={peopleFedCount}
                      onChange={(e) => setPeopleFedCount(e.target.value)}
                      placeholder="e.g. 20"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
                  >
                    {submitting ? 'Saving...' : 'Mark as delivered'}
                  </button>
                </form>
              </>
            )}

            {listing.status === 'DELIVERED' && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm font-medium text-emerald-800">Pickup complete</p>
                <p className="text-xs text-emerald-600 mt-1">
                  {listing.peopleFedCount} people fed · {listing.beneficiaryType?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default PickupDetail
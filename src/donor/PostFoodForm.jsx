import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postFood } from '../api/donorApi'
import ImageUploadInput from '../components/ImageUploadInput'

function PostFoodForm() {
  const navigate = useNavigate()

  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [foodType, setFoodType] = useState('VEG')
  const [photoUrl, setPhotoUrl] = useState('')
  const [preparedTime, setPreparedTime] = useState('')
  const [availableUntil, setAvailableUntil] = useState('')
  const [pickupAddress, setPickupAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [safetyConfirmed, setSafetyConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!safetyConfirmed) {
      setError('Please confirm the food safety checkbox before posting')
      return
    }

    setLoading(true)
    try {
      await postFood({
        foodName,
        quantity,
        foodType,
        photoUrl,
        preparedTime,
        availableUntil,
        pickupAddress,
        notes,
        safetyConfirmed,
      })
      navigate('/donor')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 placeholder-gray-400"

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate('/donor')}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            <div>
              <p className="font-medium text-gray-900 text-sm">Post surplus food</p>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Food name</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Veg biryani"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="20 boxes"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Type</label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className={inputClass}
                >
                  <option value="VEG">Veg</option>
                  <option value="NON_VEG">Non-veg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Photo</label>
              <ImageUploadInput value={photoUrl} onChange={setPhotoUrl} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Prepared at</label>
                <input
                  type="datetime-local"
                  value={preparedTime}
                  onChange={(e) => setPreparedTime(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Available until</label>
                <input
                  type="datetime-local"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Pickup address</label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contains nuts, needs refrigeration..."
                className={inputClass}
              />
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="safety"
                checked={safetyConfirmed}
                onChange={(e) => setSafetyConfirmed(e.target.checked)}
                className="mt-0.5 flex-shrink-0"
              />
              <label htmlFor="safety" className="text-xs text-amber-800 leading-relaxed">
                I confirm this food is safe, hygienically prepared, and fit for consumption. I take responsibility for its quality.
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Posting...' : 'Post food'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default PostFoodForm
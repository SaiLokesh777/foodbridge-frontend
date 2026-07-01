import { useRef, useState } from 'react'
import { uploadImage } from '../api/uploadApi'

function ImageUploadInput({ value, onChange }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const response = await uploadImage(file)
      onChange(response.data.url)
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!value && (
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
            <span className="text-emerald-700 text-lg">+</span>
          </div>
          <span className="text-xs text-gray-500">
            {uploading ? 'Uploading...' : 'Tap to add a photo'}
          </span>
        </div>
      )}

      {value && (
        <div className="relative">
          <img src={value} alt="Food preview" className="w-full h-40 object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white text-gray-700 text-xs px-2 py-1 rounded-md border border-gray-200"
          >
            Change
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export default ImageUploadInput
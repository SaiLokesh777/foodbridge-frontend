import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerNgo } from '../api/authApi'

function RegisterNgoPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    ngoName: '',
    registrationNumber: '',
    certificateUrl: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerNgo(form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 placeholder-gray-400"
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5"

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-lg font-medium text-gray-900 mb-2">Application submitted</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your NGO account is under review. You'll receive an email once an admin approves it — usually within 24 hours.
            </p>
            <Link
              to="/login"
              className="inline-block bg-brand text-white font-medium px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-sm mx-auto">

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-semibold text-lg">F</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Register as an NGO</h1>
          <p className="text-sm text-gray-400 mt-1">Requires admin approval before you can log in</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Personal details</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            <div>
              <label className={labelClass}>Full name</label>
              <input placeholder="Your name" value={form.name} onChange={update('name')} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={update('password')} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Phone number</label>
              <input placeholder="9876543210" value={form.phone} onChange={update('phone')} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input placeholder="Area, City" value={form.address} onChange={update('address')} required className={inputClass} />
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">NGO details</p>
            </div>

            <div>
              <label className={labelClass}>NGO name</label>
              <input placeholder="Robin Hood Army Hyderabad" value={form.ngoName} onChange={update('ngoName')} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Registration number</label>
              <input placeholder="NGO registration number" value={form.registrationNumber} onChange={update('registrationNumber')} required className={inputClass} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm disabled:opacity-60 hover:opacity-90 transition-opacity mt-2"
            >
              {loading ? 'Submitting...' : 'Submit for approval'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:opacity-80">Log in</Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterNgoPage
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from './AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await loginUser({ email, password })
      login(response.data)
      const role = response.data.role
      if (role === 'DONOR') navigate('/donor')
      else if (role === 'NGO') navigate('/ngo')
      else if (role === 'ADMIN') navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 placeholder-gray-400"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-semibold text-lg">F</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Log in to your Food Bridge account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

          </form>
        </div>

        <div className="text-center mt-5 space-y-2">
          <p className="text-sm text-gray-500">
            New restaurant or hotel?{' '}
            <Link to="/register/donor" className="text-brand font-medium hover:opacity-80">
              Register as donor
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Are you an NGO?{' '}
            <Link to="/register/ngo" className="text-brand font-medium hover:opacity-80">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
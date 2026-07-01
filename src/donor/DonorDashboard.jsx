import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyPosts } from '../api/donorApi'
import { useAuth } from '../auth/AuthContext'
import StatusBadge from '../components/StatusBadge'

function DonorDashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await getMyPosts()
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load posts', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const mealsSaved = posts
    .filter((p) => p.status === 'DELIVERED')
    .reduce((sum, p) => sum + (p.peopleFedCount || 0), 0)

  const activeCount = posts.filter(
    (p) => p.status === 'AVAILABLE' || p.status === 'ACCEPTED'
  ).length

  const icons = {
    AVAILABLE: '🟡',
    ACCEPTED: '🔵',
    COLLECTED: '🔵',
    DELIVERED: '🟢',
    EXPIRED: '⚫',
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
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5"
            >
              Log out
            </button>
          </div>

          <div className="px-6 pt-6 pb-2">
            <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Good evening</p>
            <p className="text-xl font-medium text-gray-900">{user?.name}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 px-6 py-4">
            <div className="bg-emerald-50 rounded-xl p-3.5">
              <span className="text-lg">🍽️</span>
              <p className="text-xl font-medium text-emerald-800 mt-1.5">{mealsSaved}</p>
              <p className="text-xs text-emerald-700 mt-0.5">meals saved</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3.5">
              <span className="text-lg">⏳</span>
              <p className="text-xl font-medium text-orange-800 mt-1.5">{activeCount}</p>
              <p className="text-xs text-orange-700 mt-0.5">active posts</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3.5">
              <span className="text-lg">📋</span>
              <p className="text-xl font-medium text-gray-800 mt-1.5">{posts.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">total posts</p>
            </div>
          </div>

          <div className="px-6 pb-5">
            <button
              onClick={() => navigate('/donor/post')}
              className="w-full bg-brand text-white font-medium py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
            >
              + Post surplus food
            </button>
          </div>

          <div className="px-6 pb-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Recent activity</p>
          </div>

          <div className="px-6 pb-6 space-y-2">
            {loading && (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">Loading your posts...</p>
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="py-8 text-center bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700">No posts yet</p>
                <p className="text-xs text-gray-400 mt-1">Post your first surplus food above</p>
              </div>
            )}

            {!loading && posts.slice().reverse().map((post) => (
              <div
                key={post.id}
                className="border border-gray-100 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">🍱</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.foodName}, {post.quantity}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.acceptedByNgo
                        ? `${post.acceptedByNgo.name}`
                        : 'Waiting for NGO'}
                    </p>
                  </div>
                </div>
                <StatusBadge status={post.status} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
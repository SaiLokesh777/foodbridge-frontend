import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPendingNgos, approveNgo, rejectNgo, getReportSummary, getAllDonors, getAllNgos } from '../api/adminApi'
import { useAuth } from '../auth/AuthContext'
import StatusBadge from '../components/StatusBadge'

function AdminDashboard() {
  const [pendingNgos, setPendingNgos] = useState([])
  const [summary, setSummary] = useState(null)
  const [allDonors, setAllDonors] = useState([])
  const [allNgos, setAllNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [pendingRes, summaryRes, donorsRes, ngosRes] = await Promise.all([
        getPendingNgos(),
        getReportSummary(),
        getAllDonors(),
        getAllNgos(),
      ])
      setPendingNgos(pendingRes.data)
      setSummary(summaryRes.data)
      setAllDonors(donorsRes.data)
      setAllNgos(ngosRes.data)
    } catch (err) {
      console.error('Failed to load admin data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setActionError('')
    try {
      await approveNgo(id)
      loadData()
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    setActionError('')
    try {
      await rejectNgo(id)
      loadData()
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to reject')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl my-6 overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900 text-sm">Admin dashboard</p>
            <p className="text-xs text-gray-400">Food Bridge</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
            Log out
          </button>
        </div>

        {!loading && summary && (
          <div className="grid grid-cols-4 gap-2 px-5 py-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-lg font-medium text-emerald-800">{summary.totalMealsSaved}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">meals saved</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-lg font-medium text-blue-800">{summary.activeDonors}</p>
              <p className="text-[11px] text-blue-700 mt-0.5">donors</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-lg font-medium text-purple-800">{summary.activeNgos}</p>
              <p className="text-[11px] text-purple-700 mt-0.5">ngos</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-lg font-medium text-orange-800">{summary.deliveryRate.toFixed(0)}%</p>
              <p className="text-[11px] text-orange-700 mt-0.5">delivery rate</p>
            </div>
          </div>
        )}

        <div className="px-5 pb-2 pt-2">
          <p className="text-sm font-medium text-gray-700">Pending NGO approvals</p>
        </div>

        <div className="px-5 pb-5 space-y-2">
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{actionError}</p>
          )}

          {loading && <p className="text-sm text-gray-400 py-4">Loading...</p>}

          {!loading && pendingNgos.length === 0 && (
            <div className="flex flex-col items-center text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">All caught up</p>
              <p className="text-xs text-gray-400 mt-1">No NGO applications waiting for review.</p>
            </div>
          )}

          {!loading && pendingNgos.map((ngo) => (
            <div key={ngo.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                <p className="text-xs text-gray-500">{ngo.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(ngo.id)}
                  className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-md font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(ngo.id)}
                  className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-md font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-2 border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700">All donors ({allDonors.length})</p>
        </div>
        <div className="px-5 pb-5 space-y-2">
          {!loading && allDonors.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No donors registered yet.</p>
          )}
          {!loading && allDonors.map((donor) => (
            <div key={donor.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{donor.name}</p>
                <p className="text-xs text-gray-500">{donor.email}</p>
              </div>
              <StatusBadge status={donor.status} />
            </div>
          ))}
        </div>

        <div className="px-5 pb-2 border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700">All NGOs ({allNgos.length})</p>
        </div>
        <div className="px-5 pb-5 space-y-2">
          {!loading && allNgos.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No NGOs registered yet.</p>
          )}
          {!loading && allNgos.map((ngo) => (
            <div key={ngo.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{ngo.name}</p>
                <p className="text-xs text-gray-500">{ngo.email}</p>
              </div>
              <StatusBadge status={ngo.status} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
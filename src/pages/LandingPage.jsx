import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 1600
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return <span>{display}{suffix}</span>
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
              <span className="text-white font-semibold text-sm">F</span>
            </div>
            <span className="font-medium text-gray-900">Food Bridge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link
              to="/register/donor"
              className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-medium px-3 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live in Hyderabad
        </div>

        <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 leading-tight mb-5">
          Surplus food, meet<br />
          <span className="text-brand">the people who need it</span>
        </h1>

        <p className="text-base text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
          Restaurants post extra food in seconds. Verified NGOs get notified instantly
          and pick it up — before it goes to waste.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register/donor"
            className="bg-brand text-white font-medium px-7 py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            I'm a donor — register free
          </Link>
          <Link
            to="/register/ngo"
            className="border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            I'm an NGO
          </Link>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-medium text-emerald-700 mb-1">
              <AnimatedNumber value={340} />
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">meals saved</p>
          </div>
          <div>
            <p className="text-4xl font-medium text-gray-900 mb-1">
              <AnimatedNumber value={8} />
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">restaurants donating</p>
          </div>
          <div>
            <p className="text-4xl font-medium text-gray-900 mb-1">
              <AnimatedNumber value={5} />
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">ngos verified</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-center text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          How it works
        </p>
        <h2 className="text-center text-2xl font-medium text-gray-900 mb-14">
          From extra plates to empty stomachs, in three steps
        </h2>

        <div className="grid sm:grid-cols-3 gap-8">

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <p className="font-medium text-gray-900 mb-2">Post the surplus</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Snap a photo, add the quantity and pickup window. Takes under a minute.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="font-medium text-gray-900 mb-2">NGO accepts instantly</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every verified NGO gets notified the moment it's posted. First to accept gets it.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❤️</span>
            </div>
            <p className="font-medium text-gray-900 mb-2">Food reaches people</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Pickup, delivery, and proof photos tracked end to end, every single time.
            </p>
          </div>

        </div>
      </section>

      <section className="bg-brand mx-4 sm:mx-auto max-w-3xl rounded-2xl mb-16 px-8 py-14 text-center">
        <h2 className="text-2xl font-medium text-white mb-3">
          Food isn't scarce. Its distribution is.
        </h2>
        <p className="text-sm text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
          Join the restaurants and NGOs already closing that gap in Hyderabad, one meal at a time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register/donor"
            className="bg-white text-brand font-medium px-7 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Register as donor
          </Link>
          <Link
            to="/register/ngo"
            className="border border-white/30 text-white font-medium px-7 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Register as NGO
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-semibold text-xs">F</span>
            </div>
            <span className="text-sm text-gray-500">Food Bridge · Hyderabad</span>
          </div>
          <p className="text-xs text-gray-400">Reducing food waste, one plate at a time.</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
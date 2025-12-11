import React, { useEffect, useState } from 'react'
import { Home, PlusCircle, BarChart3, User, MapPin, Menu, Sun, Moon } from 'lucide-react'

const Navbar = ({ activeTab, setActiveTab, user }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } catch (e) {
      return 'light'
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">CivicReport</h1>
          </div>
          
          <div className="hidden md:flex gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle size={20} />
              <span>Report Issue</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
              <User size={18} className="text-gray-600 dark:text-gray-200" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100">{user || 'Guest'}</span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden sm:inline text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button className="md:hidden">
              <Menu className="text-gray-600 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
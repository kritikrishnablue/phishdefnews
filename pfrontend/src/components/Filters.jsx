import { useState, useEffect } from 'react'

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'in', name: 'India' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  // Add more as needed
]

const categories = [
  'general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'
]

const sources = [
  { value: 'all', label: 'All Sources' },
  { value: 'newsapi', label: 'NewsAPI' },
  { value: 'gnews', label: 'GNews' },
]

export default function Filters({ values, onChange, disableCategory = false }) {
  const [local, setLocal] = useState(values || {
    country: 'us',
    category: '',
    source: 'all',
    q: ''
  })
  const [channels, setChannels] = useState([])

  useEffect(() => {
    // Fetch channels from backend
    fetch('http://127.0.0.1:8000/news/channels')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || [])
      })
      .catch(() => setChannels([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...local, [name]: value }
    setLocal(updated)
    onChange && onChange(updated)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Country</label>
        <select 
          name="country" 
          value={local.country} 
          onChange={handleChange} 
          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</label>
        <select 
          name="category" 
          value={local.category} 
          onChange={handleChange} 
          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          disabled={disableCategory}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Source</label>
        <select 
          name="source" 
          value={local.source} 
          onChange={handleChange} 
          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Sources</option>
          {channels.map(channel => <option key={channel} value={channel}>{channel}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Search</label>
        <input
          name="q"
          value={local.q}
          onChange={handleChange}
          placeholder="Search keywords..."
          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  )
} 
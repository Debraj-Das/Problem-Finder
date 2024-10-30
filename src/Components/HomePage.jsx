'use client'

import { useState } from 'react'
import { Search, Mic } from 'lucide-react'

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [platform, setPlatform] = useState('both')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10

  const handleSearch = async (e, newPlatform = platform) => {       
    if(e) e.preventDefault()
    setLoading(true)
    setError(null)
    setCurrentPage(1) // Reset to first page on new search

    try {
      let url = 'https://problemfinderapi.onrender.com/'
      
      if (newPlatform === 'leetcode') {
        url = 'https://problemfinderapi.onrender.com/leetcode'
      } else if (newPlatform === 'codeforces') {
        url = 'https://problemfinderapi.onrender.com/codeforce'
      }

      if (searchQuery) {
        url += `?q=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Sort results by score in descending order
      const sortedResults = data.sort((a, b) => b.score - a.score)
      setResults(sortedResults)
    } catch (error) {
      setError(error.message || 'Failed to fetch results. Please try again later.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Get current result for pagination
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult)
  const totalPages = Math.ceil(results.length / resultsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle platform change
  const handlePlatformChange = (e) => {
    const newPlatform = e.target.value
    setPlatform(newPlatform)
    if (searchQuery) { // Only trigger search if there's a query
      handleSearch(null, newPlatform)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-14 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-8xl font-normal mb-4">
          <span className="text-blue-500">P</span>
          <span className="text-red-500">r</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">b</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
          <span className="text-yellow-500">m</span>
          <span className="text-blue-500 ml-2">Finder</span>
        </h1>
      </div>

      <div className="w-full max-w-2xl px-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div className="flex items-center w-full border border-gray-200 rounded-full px-5 py-3 hover:shadow-md focus-within:shadow-md bg-white">
            <Search className="text-gray-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coding problems"
              className="flex-1 outline-none text-gray-700"
            />
            <Mic className="text-blue-500 ml-3" />
          </div>
        </form>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-gray-700">
        <span>Search by platform:</span>
        <select
          value={platform}
          onChange={handlePlatformChange}
          className="bg-white border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer hover:border-blue-500 transition-colors"
        >
          <option value="both">All</option>
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">CodeForces</option>
        </select>
      </div>

      {loading && (
        <div className="mt-8 text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="mt-8 text-red-500">{error}</div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="mt-4 w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {currentResults.slice(0, 5).map((result, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <a 
                      className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors" 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.name}
                    </a>                   
                  </div>                
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {currentResults.slice(5, 10).map((result, index) => (
                <div key={index + 5} className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <a 
                      className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors" 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.name}
                    </a>                   
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Previous
            </button>
            <span className="text-gray-600 bg-white px-4 py-2 rounded-md border">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
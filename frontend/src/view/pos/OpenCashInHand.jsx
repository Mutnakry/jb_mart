

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../service/api"
import Navbar from "../../component/Navbar"

const OpenCashInHand = () => {
  const navigate = useNavigate()
  const [userLoginNames, setUserLoginNames] = useState("")
  const [shift, setShift] = useState("Morning")
  const [opening_balance, setOpeningBalance] = useState("")
  const [currentShift, setCurrentShift] = useState(null)
  const [getID, setGetID] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCurrentShift()
    const storedUserId = localStorage.getItem("user_id") || ""
    setUserLoginNames(storedUserId)
  }, [])

  const startShift = async (e) => {
    e.preventDefault()
    setError("")

    if (!opening_balance || Number.parseFloat(opening_balance) <= 0) {
      setError("បើកការលក់មិនអាចតូចជាងសូន្យ​នោះទេ")
      return
    }

    setIsLoading(true)

    const shiftData = {
      shift: shift,
      opening_balance: opening_balance,
      cashier_id: userLoginNames,
    }


    console.log(shiftData)

    try {
      const response = await axios.post(`${API_URL}/api/opencash`, shiftData)
      toast.success("Shift started successfully!")
      setCurrentShift(response.data)
      setGetID(response.data.id)
      navigate("/index/pos")
    } catch (error) {
      toast.error("Failed to start shift")
      setError(error.response?.data?.message || "Failed to start shift. Please try again.")
      console.error("Error details:", error.response ? error.response.data : error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch active shift
  const fetchCurrentShift = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/opencash/active`)

      if (response.data) {
        setCurrentShift(response.data)
        setGetID(response.data.id)
        navigate("/index/pos")
      } else {
        setCurrentShift(null)
        setGetID(null)
        navigate("/check/pos")
      }

      if (response.data === null) {
        toast.info("A shift is already active! Close the current shift first.")
        navigate("/check/pos")
      }
    } catch (error) {
      console.error("Error fetching shift:", error)
      setCurrentShift(null)
      setGetID(null)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:ml-64 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-up animate-duration-500">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">ចាប់ផ្តើម បើលការលក់</h2>
          </div>

          {/* Card Content */}
          <div className="px-6 py-5">
            <form onSubmit={startShift} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-medium">Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="shift" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ការបើកពេល​ :
                </label>
                <select
                  id="shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  disabled={!!getID}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="opening_balance"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ការបើកសមតុល្យ ($) :
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="opening_balance"
                    type="number"
                    value={opening_balance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    required
                    disabled={!!getID}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {getID && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-lg flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-medium">Active Shift</h3>
                    <p className="text-sm">
                      A shift is already active. Close the current shift before entering an opening balance.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              onClick={startShift}
              disabled={isLoading || !!getID}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-blue-500"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "ចាប់ផ្តើមបើក"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenCashInHand

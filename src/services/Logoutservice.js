import axios from 'axios'
import { ClearLocalStorage } from './localStorageService'
import ApiUrl from './apiheaders'

export const logout = async ({ dispatch, navigate, toast }) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found in localStorage')
      toast.error('You are not logged in.')
      return
    }

    const logoutResponse = await axios.post(`${ApiUrl.Logout}`, {
      Token: token,
    })

    if (logoutResponse.data.statusCode !== 200) {
      console.error('Logout failed:', logoutResponse.data.message)
      toast.error('Logout failed. Please try again.')
      return
    }

    const cleared = ClearLocalStorage()
    dispatch({ type: 'set', userType: '', userName: '' })

    if (cleared === true) {
      navigate('/login')
    }

    console.log('Logout successful:', logoutResponse.data.message)
    toast.success('Logout successful')
  } catch (error) {
    console.error('Error during logout:', error)
    toast.error('Logout failed. Please try again.')
  }
}

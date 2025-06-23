import { useEffect, useState } from 'react'
import axios from 'axios'

const useFetch = async(url, method = 'get', body = null, config = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        if (method.toLowerCase() === 'get') {
          response = await axios.get(url, config)
        } else {
          response = await axios[method.toLowerCase()](url, body, config)
        }
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, method, body, config])

  return { data, loading, error }
}

export default useFetch

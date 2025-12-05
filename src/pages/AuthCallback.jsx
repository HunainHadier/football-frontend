import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import topTost from '@/utils/topTost'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token')
      const user = searchParams.get('user')
      const error = searchParams.get('error')
      const success = searchParams.get('success')

      if (error) {
        console.error('OAuth Error:', error)
        navigate('/login?error=' + encodeURIComponent(error))
        return
      }

      if (success && token && user) {
        try {
          // ✅ Decode token to extract role & company info
          const decoded = jwtDecode(token)
          console.log('Decoded JWT:', decoded)

          // ✅ Save all details in localStorage (same as normal login)
          localStorage.setItem('authToken', token)
          localStorage.setItem('user', user)
          localStorage.setItem('role', decoded.role || 'user')
          localStorage.setItem('company_id', decoded.company_id || 0)

          topTost('Login Successful ✅')

          navigate('/') // redirect to home
        } catch (err) {
          console.error('Auth callback error:', err)
          navigate('/login?error=' + encodeURIComponent('Authentication failed'))
        }
      } else {
        navigate('/login?error=' + encodeURIComponent('Invalid authentication response'))
      }
    }

    handleOAuthCallback()
  }, [searchParams, navigate])

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-14">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback

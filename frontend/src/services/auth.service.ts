// Function to verify if the user is an admin
export const isAdmin = (): boolean => {
  try {
    const adminData = localStorage.getItem('admin')

    if (!adminData) {
      return false
    }

    const parsed = JSON.parse(adminData)
    const token = parsed.token

    if (!token) {
      return false
    }

    // Decode the JWT token to check if it's valid and has admin role
    const payload = JSON.parse(atob(token.split('.')[1]))

    // Check if the token has expired
    if (payload.exp * 1000 < Date.now()) {
      // Token expired, remove it
      localStorage.removeItem('admin')
      return false
    }

    // Check if the user has admin role
    return payload.role === 'admin'
  } catch (error) {
    // If there's an error decoding the token, remove it
    localStorage.removeItem('admin')
    return false
  }
}

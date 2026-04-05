import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />
  }

  return children
}
export interface AdminUser {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "super_admin"
  createdAt: string
}

// Default admin users (in production, store in database with hashed passwords)
export const adminUsers: AdminUser[] = [
  {
    id: "1",
    email: "admin@fmosweb.com",
    password: "admin123", // In production, this should be hashed
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "superadmin@fmosweb.com",
    password: "super123",
    name: "Super Admin",
    role: "super_admin",
    createdAt: new Date().toISOString(),
  },
]

// Function to change admin password
export const changeAdminPassword = (email: string, oldPassword: string, newPassword: string): boolean => {
  const adminIndex = adminUsers.findIndex((admin) => admin.email === email)

  if (adminIndex === -1) {
    return false // Admin not found
  }

  if (adminUsers[adminIndex].password !== oldPassword) {
    return false // Wrong old password
  }

  // Update password
  adminUsers[adminIndex].password = newPassword
  return true
}

// Function to verify admin credentials
export const verifyAdminCredentials = (email: string, password: string): AdminUser | null => {
  const admin = adminUsers.find((admin) => admin.email === email && admin.password === password)
  return admin || null
}

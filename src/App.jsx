import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'
import HomePage from './pages/public/HomePage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<div className="container mx-auto py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">This page will be dynamically rendered from CMS content</p>
          </div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pages" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Pages</h1>
            <p className="text-muted-foreground mt-2">Pages management will be implemented here</p>
          </div>} />
          <Route path="media" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-2">Media library will be implemented here</p>
          </div>} />
          <Route path="menus" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Menus</h1>
            <p className="text-muted-foreground mt-2">Menu management will be implemented here</p>
          </div>} />
          <Route path="users" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-2">User management will be implemented here</p>
          </div>} />
          <Route path="settings" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">Settings will be implemented here</p>
          </div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

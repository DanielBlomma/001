import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import PublicPage from './pages/public/PublicPage'
import AdminLogin from './pages/admin/AdminLogin'
import ForgotPassword from './pages/admin/ForgotPassword'
import ResetPassword from './pages/admin/ResetPassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import PagesListPage from './pages/admin/PagesListPage'
import PageEditorPage from './pages/admin/PageEditorPage'
import UsersListPage from './pages/admin/UsersListPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":slug" element={<PublicPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="pages" element={<PagesListPage />} />
          <Route path="pages/new" element={<PageEditorPage />} />
          <Route path="pages/:id/edit" element={<PageEditorPage />} />
          <Route path="media" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-2">Media library will be implemented here</p>
          </div>} />
          <Route path="menus" element={<div className="p-6">
            <h1 className="text-2xl font-bold">Menus</h1>
            <p className="text-muted-foreground mt-2">Menu management will be implemented here</p>
          </div>} />
          <Route path="users" element={<UsersListPage />} />
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

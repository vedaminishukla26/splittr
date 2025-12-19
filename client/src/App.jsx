import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'
import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import strings from './constants/strings'
import DashboardLayout from './components/DashboardLayout'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" />
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{strings.welcomeUser(user.name)}</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}

const queryClient = new QueryClient(); 

const  App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path='/groups' element={
              <ProtectedRoute>
                <DashboardLayout title={strings.manageGroups} >
                  <Groups />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path='/' element={<Navigate to="/dashboard" replace />} /> 
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

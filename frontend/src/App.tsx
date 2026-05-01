import  { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ClientesList from './pages/ClientesList';
import ClienteForm from './pages/ClienteForm';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';

function App(): JSX.Element {
  console.log("APP")
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/clientes" element={
          <PrivateRoute>
            <ClientesList />
          </PrivateRoute>
        } />
        <Route path="/clientes/nuevo" element={
          <PrivateRoute>
            <ClienteForm />
          </PrivateRoute>
        } />
        <Route path="/clientes/editar/:id" element={
          <PrivateRoute>
            <ClienteForm />
          </PrivateRoute>
        } />
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
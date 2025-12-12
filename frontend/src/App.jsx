import { Routes, Route, Navigate } from 'react-router'
import { useUser } from '@clerk/clerk-react'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage'

function App() {
  const { isSignedIn, isLoaded } = useUser();
  //this will get rid of the flickering effect when we reload dashboard page
  if (!isLoaded) return null;
  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}></Route>
      </Routes>
      

      <Toaster toastOptions={{duration: 3000}}/>
    </>
  );
}

export default App

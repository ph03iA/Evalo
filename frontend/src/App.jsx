import { Routes, Route, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import DashboardPage from "./pages/DashboardPage";

const queryClient = new QueryClient();

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </QueryClientProvider>
  );
}

export default App;
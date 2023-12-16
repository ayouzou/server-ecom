import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from './context/auth';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { Toaster } from 'react-hot-toast';
import Home from './Home';








function App() {
  const queryclient = new QueryClient;

  return (
    <QueryClientProvider client={queryclient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider>
       <Toaster />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={  <Home />} />
            <Route path="/login" element={  <Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>     
    </QueryClientProvider>
  )
}

export default App

import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import {FilterProvider} from './contexts/FilterContext.tsx'
import { KorisnikProvider } from './contexts/KorisnikContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <KorisnikProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </KorisnikProvider>
    </AuthProvider>
  </QueryClientProvider>,
)

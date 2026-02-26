import { BrowserRouter } from 'react-router-dom';
import '@/styles/theme.css';
import AppRoutes from '@/routes';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

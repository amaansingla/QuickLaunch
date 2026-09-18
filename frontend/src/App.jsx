import { Routes, Route } from 'react-router-dom';
import ProductForm from './ProductForm';
import PublicPage from './PublicPage';
import Dashboard from './Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <h1>QuickLaunch</h1>
          <ProductForm />
        </div>
      } />
      <Route path="/p/:slug" element={<PublicPage />} />
      <Route path="/dashboard/:slug" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
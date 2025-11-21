import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DigitalPrint from './pages/DigitalPrint';
import VisitingCards from './pages/VisitingCards';
import ProductDetail from './pages/ProductDetail';
import Upload from './pages/Upload';
import About from './pages/About';
import Policy from './pages/Policy';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="digital-print" element={<DigitalPrint />} />
          <Route path="digital-print/:categoryId" element={<VisitingCards />} />
          <Route path="digital-print/:categoryId/:productId" element={<ProductDetail />} />
          <Route path="upload" element={<Upload />} />
          <Route path="about" element={<About />} />
          <Route path="policy" element={<Policy />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
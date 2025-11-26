import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";

// STORE
import Home from "./modules/store/Home.jsx";
import ProductList from "./modules/store/ProductList.jsx";
import ProductDetail from "./modules/store/ProductDetail.jsx";
import Cart from "./modules/store/Cart.jsx";
import Checkout from "./modules/store/Checkout.jsx";

// ADMIN
import AdminMain from "./modules/admin/AdminMain.jsx";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Tienda */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminMain />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

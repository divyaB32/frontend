import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import ProductPreview from "./pages/ProductPreview";
import Visualize from "./pages/visualize";
import AdminDashboard from "./pages/AdminDashboard";
import MatchTiles from "./pages/MatchTiles";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Page Content */}
      <div style={{ paddingTop: "90px", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductPreview />} />
          <Route path="/visualize/:id" element={<Visualize />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/match-tiles" element={<MatchTiles />} />

        </Routes>
      </div>

      {/* Footer ALWAYS at bottom */}
      <Footer />
    </Router>
  );
}

export default App;

import React from "react";
import Main from "./pages/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chart from "./pages/Chart/Chart";
import History from "./pages/History/History";
import Product from "./pages/Product/Product";
import Order from "./pages/Order/Order";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Wrapper from "./components/Wrapper/Wrapper";

function App() {
  return (
    <>
      <Router>
        <Wrapper>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Wrapper>
        <Footer />
      </Router>
    </>
  );
}

export default App;

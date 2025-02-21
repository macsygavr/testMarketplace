import React from "react";
import Main from "./pages/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chart from "./pages/Chart/Chart";
import History from "./pages/History/History";
import Product from "./pages/Product/Product";
import Order from "./pages/Order/Order";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SideMenuWrapper from "./components/SideMenuWrapper/SideMenuWrapper";
import PageWrapper from "./components/PageWrapper/PageWrapper";

function App() {
  return (
    <>
      <Router>
        <SideMenuWrapper>
          <Header />
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/chart" element={<Chart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </PageWrapper>
        </SideMenuWrapper>
        <Footer />
      </Router>
    </>
  );
}

export default App;

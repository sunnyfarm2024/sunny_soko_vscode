import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/Main/Main";
import Shop from "./components/Shop/Shop";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/payments/:status" element={<Home />} /> {/* Home에서 처리 */}
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:status" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;

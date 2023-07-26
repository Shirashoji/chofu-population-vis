import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./components/Navigation";
import FilterMenu from "./components/FilterMenu";
import MapMenu from "./components/MapMenu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ background: "white" }}>
      <CssBaseline />
      <Navigation style={{ background: "white" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapMenu />} />
            <Route path="/map" element={<MapMenu />} />
            <Route path="/filter" element={<FilterMenu />} />
            {/* <Route path="/hist" element= /> */}
          </Routes>
        </BrowserRouter>
      </Navigation>
    </div>
  );
}

export default App;

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navigation from "./components/Navigation";
import FilterMenu from "./components/FilterMenu";
import MapMenu from "./components/MapMenu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navigation>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapMenu />} />
            <Route path="/map" element={<MapMenu />} />
            <Route path="/filter" element={<FilterMenu />} />
          </Routes>
        </BrowserRouter>
      </Navigation>
    </>
  );
}

export default App;

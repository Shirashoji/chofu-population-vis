import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./components/Navigation";
import FilterMenu from "./components/FilterMenu";
import MapMenu from "./components/MapMenu";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <div style={{ background: "white" }}>
      <CssBaseline />
      <Navigation style={{ background: "white" }}>
        <Routes>
          <Route path="/" element={<MapMenu />} />
          <Route path="/map" element={<MapMenu />} />
          <Route path="/filter" element={<FilterMenu />} />
        </Routes>
      </Navigation>
    </div>
  );
}

export default App;

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navigation from "./components/Navigation";
import HistMenu from "./components/HistMenu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navigation>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hist" element={<HistMenu />} />
            <Route path="/pyramid" element={<HistMenu />} />
            <Route path="/blog/*" element={<BlogApp />} />
            <Route path="/users/*" element={<UserApp />} />
          </Routes>
        </BrowserRouter>
      </Navigation>
    </>
  );
}

function Home() {
  return (
    <>
      <h1>Welcome!</h1>
      <p>
        Check out the <Link to="/hist">Pyramid</Link> Page.
      </p>
    </>
  );
}

function BlogApp() {
  return (
    <Routes>
      <Route index element={<h1>Blog Index</h1>} />
      <Route path="posts" element={<h1>Blog Posts</h1>} />
    </Routes>
  );
}

function UserApp() {
  return (
    <Routes>
      <Route index element={<h1>Users Index</h1>} />
    </Routes>
  );
}

export default App;

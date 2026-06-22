import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Songs from "./pages/Songs.jsx";
import Details from "./pages/Details.jsx";
import Page404 from "./pages/Page404.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="bai-hat" element={<Songs />} />
        <Route path="bai-hat/:id" element={<Details />} />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

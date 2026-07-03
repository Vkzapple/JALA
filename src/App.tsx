import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import DashboardPengelola from "./pages/DashboardPengelola";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pengelola" element={<DashboardPengelola />} />
    </Routes>
  )
}

export default App
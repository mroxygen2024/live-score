import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MatchList from "./pages/MatchList";
import MatchDetail from "./pages/MatchDetail";
import AdminPage from "./pages/AdminPanel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/matches" element={<MatchList />} />
      <Route path="/matches/:matchId" element={<MatchDetail />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

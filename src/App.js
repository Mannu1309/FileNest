import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Upload from "./components/Upload";
import SignUp from "./components/SignUp";
import SessionManager from "./components/SessionManager";

function App() {
  return (
    <Router>
      <SessionManager />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./Comps/Auth";
import Listagem from "./Comps/Listagem";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/listagem" element={<Listagem />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;

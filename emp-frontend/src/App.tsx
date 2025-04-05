import React from "react";
import EmployeeApp from "./components/EmployeeApp";
import './App.css'


const App: React.FC = () => { 
  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <EmployeeApp />
  </div>
  )
}

export default App
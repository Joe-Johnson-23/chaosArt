import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import logo from './assets/logo.png'
import './App.css'
import InfiniteSpiral from './components/InfiniteSpiral'
import StarryBackground from './components/StarryBackground'

function App() {
  const navigate = useNavigate()

  return (
    <div>
      <StarryBackground />
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <div className="header">
              <a href="https://dollarsandcents.io" target="_blank">
                <img src={logo} className="logo" alt="Joe Johnson logo" />
              </a>
              <h1>Joe Johnson</h1>
            </div>
            
            <div className="nav-circles">
              <button 
                className="circle-button"
                onClick={() => navigate('/infinite-spiral')}
              >
                Infinite Spiral
              </button>
            </div>
          </div>
        } />
        <Route path="/infinite-spiral" element={<InfiniteSpiral />} />
      </Routes>
    </div>
  )
}

export default App

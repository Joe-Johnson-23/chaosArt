import { useState } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import logo from './assets/logo.png'
import './App.css'
import InfiniteSpiral from './components/InfiniteSpiral'
import StarryBackground from './components/StarryBackground'
import { InfiniteScroll } from './components/InfiniteScroll'

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

              <button 
                className="circle-button"
                onClick={() => navigate('/infinite-scroll')}
              >
                Infinite Scroll
              </button>


             
            </div>
          </div>
        } />
        <Route path="/infinite-spiral" element={<InfiniteSpiral />} />
        <Route path="/infinite-scroll" element={<InfiniteScroll />} />
      </Routes>
    </div>
  )
}

export default App

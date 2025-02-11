import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import logo from './assets/logo.png'
import './App.css'
import InfiniteSpiral from './components/InfiniteSpiral'

function App() {
  const navigate = useNavigate()

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <div>
              <a href="https://dollarsandcents.io" target="_blank">
                <img src={logo} className="logo" alt="Joe Johnson logo" />
              </a>
            </div>
            <h1>Joe Johnson</h1>
            <div className="card">
              <button 
                onClick={() => navigate('/infinite-spiral')}
                style={{ marginLeft: '1rem' }}
              >
                Infinite Spiral
              </button>
            </div>
          </>
        } />
        <Route path="/infinite-spiral" element={<InfiniteSpiral />} />
      </Routes>
    </>
  )
}

export default App

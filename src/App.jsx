import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import InfiniteSpiral from './components/InfiniteSpiral';
import StarryBackground from './components/StarryBackground';

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#1a1a1a',
      color: 'white'
    }}>
      <h1>Welcome to Chaos Art</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <a
          href="https://dollarsandcents.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Coin Shop</button>
        </a>
        <Link to="/infinite-spiral">
          <button style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Infinite Spirals</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <StarryBackground />
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/infinite-spiral" element={<InfiniteSpiral />} />
      </Routes>
    </>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import InfiniteSpiral from './components/InfiniteSpiral';
// import CoinShop from './components/CoinShop'; // Uncomment if you have this component

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
        <Link to="/coin-shop">
          <button style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Coin Shop</button>
        </Link>
        <Link to="/infinite-spiral">
          <button style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}>Infinite Spirals</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/coin-shop" element={<CoinShop />} /> */}
      <Route path="/infinite-spiral" element={<InfiniteSpiral />} />
    </Routes>
  );
}

export default App;

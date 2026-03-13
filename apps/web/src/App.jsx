import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import MerchantSections from './components/MerchantSections';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Hero />
      <Features />
      <MerchantSections />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;

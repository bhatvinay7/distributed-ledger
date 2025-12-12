import React from 'react'
import Navbar from '../components/nav-bar'
import Hero from '../components/hero-section'
import Features from '../components/feature-component'
import PricingComponent from '../components/pricing-component'
export default function page() {
  return (
    <div className='h-screen overflow-auto w-full flex flex-col bg-white'>
      <Navbar/>
      <Hero/>
      <Features/>
      <PricingComponent/>
    </div>
  )
}

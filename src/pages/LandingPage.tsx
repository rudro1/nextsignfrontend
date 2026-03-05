import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FooterSection } from '../components/FooterSection';
export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      <main>
        <HeroSection onGetStarted={() => onNavigate('dashboard')} />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <FooterSection />
    </div>);

}
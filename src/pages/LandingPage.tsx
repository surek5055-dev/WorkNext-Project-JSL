import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';

export const LandingPage: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
    </MainLayout>
  );
};

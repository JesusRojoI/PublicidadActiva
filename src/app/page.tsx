import Hero from '@/components/home/Hero';
import WhatWeDo from '@/components/home/WhatWeDo';
import Ideas from '@/components/home/Ideas';
import WhyDifferent from '@/components/home/WhyDifferent';
import LatestDesigns from '@/components/home/LatestDesigns';
import Skills from '@/components/home/Skills';
import Fusion from '@/components/home/Fusion';
import Awarded from '@/components/home/Awarded';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Ideas />
      <WhyDifferent />
      <LatestDesigns />
      <Skills />
      <Fusion />
      <Awarded />
      <ContactSection />
    </>
  );
}
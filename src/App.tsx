import { useState } from 'react';
import { Loader } from './components/ui/Loader';
import { CustomCursor } from './components/ui/CustomCursor';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Philosophy } from './components/sections/Philosophy';
import { MenuCarousel } from './components/sections/MenuCarousel';
import { SoupeSection } from './components/sections/SoupeSection';
import { MariageSection } from './components/sections/MariageSection';
import { Access } from './components/sections/Access';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Loader onComplete={() => setIsLoading(false)} />
      
      {!isLoading && (
        <>
          <CustomCursor />
          <Header />
          
          <main>
            <Hero />
            <Philosophy />
            <MenuCarousel />
            
            {/* Soupe & Mariage Section */}
            <section className="py-24 md:py-40 px-6 md:px-20">
              <SoupeSection />
              <MariageSection />
            </section>
            
            <Access />
          </main>
          
          <Footer />
        </>
      )}
    </>
  );
}

export default App;

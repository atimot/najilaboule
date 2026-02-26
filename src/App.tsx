import { useState } from 'react';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { Footer } from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Loader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          <Header />

          <main>
            <Content />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}

export default App;

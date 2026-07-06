import { useState } from 'react';
import { Loader } from '@/components/Loader';
import { Header } from '@/components/Header';
import { Content } from '@/components/Content';
import { Footer } from '@/components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // コンテンツは最初から Loader の下にマウントしておく (LCP をローダー時間でブロックしない)。
  // inert でローダー表示中のフォーカス・クリックを遮る (inert 非対応の旧ブラウザ向けに aria-hidden も併用)
  return (
    <>
      <Loader onComplete={() => setIsLoading(false)} />

      <div inert={isLoading} aria-hidden={isLoading || undefined}>
        <Header />

        <main>
          <Content />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;

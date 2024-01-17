'use client';

import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('modules/konva/Canvas'), {
  ssr: false,
});

const Home = () => {
  return (
    <main className="grid grid-cols-main">
      <Canvas />
    </main>
  );
};

export default Home;

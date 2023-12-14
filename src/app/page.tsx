'use client';

import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('modules/konva/Canvas'), {
  ssr: false,
});

const Home = () => {
  return <Canvas />;
};

export default Home;

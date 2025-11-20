"use client";

import { HalftoneDots } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {dimensions.width > 0 && (
          <HalftoneDots
            width={dimensions.width}
            height={dimensions.height}
            image="/bg.jpg"
            colorBack="#050505"
            colorFront="#333333"
            originalColors={false}
            type="gooey"
            grid="hex"
            inverted={false}
            size={0.3}
            radius={1.25}
            contrast={0.4}
            grainMixer={0.2}
            grainOverlay={0.2}
            grainSize={0.5}
            fit="cover"
          />
        )}
      </div>

      <div className="z-10 flex flex-col items-center gap-6 text-center px-4 mix-blend-difference w-full max-w-full overflow-hidden">
        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter text-white break-words max-w-full">
          grindset.club
        </h1>
        <p className="text-sm sm:text-xl md:text-3xl text-white font-light tracking-[0.2em] sm:tracking-[0.5em] uppercase break-words max-w-full">
          Coming Soon
        </p>
      </div>
    </main>
  );
}

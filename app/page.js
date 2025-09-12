import { Dithering } from '@paper-design/shaders-react';

export default function Home() {
  return (
    <div className="flex flex-row h-screen bg-black">
      <div className="w-3/4">
        <div className='pl-5 pt-5'>
          <a className='text-4xl'>hello</a>
        </div>
      </div>
        <div className="w-1/4">
        <Dithering
          className='h-screen'
          colorBack="#000000"
          colorFront="#a50aff"
          shape="dots"
          type="random"
          pxSize={9}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
        />
      </div>
    </div>
  );
}

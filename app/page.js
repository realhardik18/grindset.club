"use client";

import { Dithering } from '@paper-design/shaders-react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks=useQuery(api.tasks.get)
  console.log(tasks)
  return (
    <div className="flex flex-row h-screen bg-black">
      <div className="w-3/4">
        <div className='pl-5 pt-5'>
        {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
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

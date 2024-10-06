"use client";

import { forwardRef, Suspense, useImperativeHandle, useRef } from "react";
import { PerspectiveCamera, View as ViewImpl } from "@react-three/drei";
import { Three } from "./three";

interface CommonProps {
  color?: string;
}

export const Common = ({ color }: CommonProps) => (
  <Suspense fallback={null}>
    {/* {color && <color attach="background" args={[color]} />} */}
    {/*     <ambientLight intensity={0.1} /> */}
    {/*  <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color="blue" /> */}
    <PerspectiveCamera makeDefault fov={10} position={[0, 0, 0]} />
  </Suspense>
);

interface ViewProps {
  children?: React.ReactNode;
  orbit?: boolean;
  [key: string]: any;
}

const View = forwardRef<HTMLDivElement, ViewProps>(
  ({ children, orbit, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    return (
      <>
        <div ref={localRef} {...props} />
        <Three>
          <ViewImpl track={localRef as React.MutableRefObject<HTMLElement>}>
            {children}
          </ViewImpl>
        </Three>
      </>
    );
  }
);
View.displayName = "View";

export { View };

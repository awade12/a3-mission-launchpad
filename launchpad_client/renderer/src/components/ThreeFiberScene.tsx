import { Canvas } from '@react-three/fiber'

export type ThreeFiberSceneProps = {
  width?: number
  height?: number
  children: React.ReactNode
}

export function ThreeFiberScene({ width = 100, height = 100, children }: ThreeFiberSceneProps) {
  return (
    <div id="canvas-container">
      <Canvas style={{ width: `${width}px`, height: `${height}px` }}>
        {children}
      </Canvas>
    </div>
  )
}
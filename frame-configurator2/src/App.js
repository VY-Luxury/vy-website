import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Center, OrbitControls, AccumulativeShadows, RandomizedLight, MeshRefractionMaterial, useEnvironment, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, N8AO, ToneMapping } from '@react-three/postprocessing'
import { useControls } from 'leva'

function Glasses({ frameColor, armsColor, lensesColor, env, ...props }) {
  const { nodes, materials } = useGLTF('/CE-Frames.glb')

  return (
    <group {...props} dispose={null}>
      <mesh castShadow geometry={nodes.Full_CE_Test1.geometry}>
        <meshStandardMaterial color={armsColor} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
      <mesh castShadow geometry={nodes.Full_CE_Test1001.geometry}>
        <meshPhysicalMaterial
          color={lensesColor}
          transmission={1} // Enable transparency
          transparent={true} // Allow transparency
          opacity={0.9}
          reflectivity={0.5} // Reflective
          clearcoat={1} // Add clear coat for extra shininess
          clearcoatRoughness={0} // Smooth clear coat
        />
      </mesh>
      <mesh castShadow geometry={nodes.Full_CE_Test1002.geometry}>
        <meshStandardMaterial color={armsColor} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
      <mesh castShadow geometry={nodes.Full_CE_Test1003.geometry}>
        <meshStandardMaterial color={frameColor} roughness={0.15} envMapIntensity={1.5} />
      </mesh>
    </group>
  )
}

export default function App() {
  const { shadow, frame, arms, lenses } = useControls({ shadow: '#000000', frame: '#fff0f0', arms: '#ffffff', lenses: '#ffffff' })
  const env = useEnvironment({ files: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr' })
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [-5, 5, 14], fov: 20 }}>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <group position={[0, -0.25, 0]}>
        <Center top position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <Glasses frameColor={frame} armsColor={arms} lensesColor={lenses} env={env} scale={0.2} />
        </Center>
        <AccumulativeShadows temporal frames={100} color={shadow} opacity={1.05}>
          <RandomizedLight radius={5} position={[10, 5, -5]} />
        </AccumulativeShadows>
      </group>
      <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />
        <Bloom luminanceThreshold={3.5} intensity={0.85} levels={9} mipmapBlur />
        <ToneMapping />
      </EffectComposer>
      <Environment map={env} background blur={1} />
    </Canvas>
  )
}

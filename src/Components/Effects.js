import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from './post/Glitchpass'
import { WaterPass } from './post/Waterpass'
import { RgbshiftPass } from './post/Rgbshiftpass'

extend({ EffectComposer, ShaderPass, RenderPass, WaterPass, UnrealBloomPass, FilmPass, GlitchPass, RgbshiftPass })

export default function Effects({ animationGlitch, glitchIntensity ,...props }) {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <waterPass attachArray="passes" factor={0.1} />
      <unrealBloomPass attachArray="passes" args={[aspect, props.bloomLvl, 0.5, 0]} />
      <filmPass attachArray="passes" args={[0.25, 0.25, 648, false]} />
      <glitchPass attachArray="passes" factor={animationGlitch ? 1 : 0} glitchIntensity={glitchIntensity} />
      <rgbshiftPass attachArray="passes" factor={0.25} />
    </effectComposer>
  )
}

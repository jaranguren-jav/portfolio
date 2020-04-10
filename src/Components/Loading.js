import * as THREE from "three"
import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import Effects from "./Effects"

//Helper variable
let direction = false

export default function Loading(scale, ...props) {
  //Box reference
  const box = useRef()
  //Geometry
  let container_geometry = new THREE.PlaneBufferGeometry( 3, 0.1, 4 )
  let box_geometry = new THREE.PlaneBufferGeometry( 0.5, 0.1, 1 )
  //Materials
  let material = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2})
  let material_container = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2,wireframe:true})

  useFrame(() => {
    //Setting turning points
    direction ? box.current.position.x -= 0.1 : box.current.position.x += 0.1 
    //Conditionally changing directions
    if(box.current.position.x >= 1.25){
      direction = true
    } else if (box.current.position.x <= -1.25){
      direction = false
    }
  })

  return ( 
    <group scale={scale.scale === "small" ? [0.5,0.5,0.5] : [1,1,1]}>  
      <mesh geometry={container_geometry} material={ material_container} ></mesh>
      <mesh ref={box}  geometry={box_geometry} material={material} ></mesh>
      <Effects animationGlitch={true} glitchIntensity={0.025} bloomLvl={0.75}/>
    </group>
  )
}


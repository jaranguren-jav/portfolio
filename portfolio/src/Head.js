import * as THREE from "three"
import React, { Suspense, useEffect, useRef, useState, PureComponent  } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import lerp from "lerp"
import { getMouseDegrees } from "./utils"
import { CubeRefractionMapping } from "three"

function moveHead(mouse, head, degreeLimit = 20) {
    let eyes = [head.children[0],head.children[1],head.children[2],head.children[3]]

    let degrees = getMouseDegrees(mouse.x, mouse.y, 20)
    head.rotation.xD = lerp(head.rotation.xD || 0, degrees.y, 0.1)
    head.rotation.yD = lerp(head.rotation.yD || 0, degrees.x, 0.1)
    head.rotation.x = THREE.Math.degToRad(head.rotation.xD)
    head.rotation.y = THREE.Math.degToRad(head.rotation.yD)

    eyes.map((item) => {
        item.rotation.xD = lerp(item.rotation.xD || 0, degrees.y, 0.2)
        item.rotation.yD = lerp(item.rotation.yD || 0, degrees.x, 0.2)
        item.rotation.x = THREE.Math.degToRad(item.rotation.xD)
        item.rotation.y = THREE.Math.degToRad(item.rotation.yD)
    })
  }


function line(event, hoveredItem,font){
  if(event.eventObject){

  let secondPoint
  let thirdPoint
  let objectRot = event.eventObject.quaternion._w
  let origin 
  let message
  let textPosX
  let textPosY = 0

  switch(hoveredItem) {
    case "ux":
      origin = {x: 0,y: 0.5} 
      secondPoint = Math.abs(objectRot) > 0.7 ? {x: 1,y: 1.75} : {x: -1,y: 1.75}
      thirdPoint = Math.abs(objectRot) > 0.7 ? {x: 1.5,y: 1.75} : {x: -1.5,y: 1.75}
      textPosX = Math.abs(objectRot) > 0.7 ? 0.1 : -1.25
      textPosY = - 0.075
      message = "UX / UI"
      break;
    case "frontend":
      origin = {x: 0,y: 0.5} 
      secondPoint = Math.abs(objectRot) > 0.7  ? {x: -1,y: 1.75} : {x: 1,y: 1.75}
      thirdPoint = Math.abs(objectRot) > 0.7  ? {x: -1.5,y: 1.75} : {x: 1.5,y: 1.75}
      textPosX = Math.abs(objectRot) > 0.7 ? -1.5 : 0.1 
      message = "FRONTEND\nDEVELOPER"
      break;
    case "graphic":
      origin = {x: 0,y: 0} 
      secondPoint = Math.abs(objectRot) > 0.7  ? {x: -1.75,y: -0.5} : {x: 1.75,y: -0.5}
      thirdPoint = Math.abs(objectRot) > 0.7  ? {x: -2.25,y: -0.5} : {x: 2.25,y: -0.5}
      textPosX = Math.abs(objectRot) > 0.7 ? -1.5 : 0.1
      message = "GRAPHIC\nDESIGNER"
    break;
    case "3d":
      origin = {x: 0,y: 0} 
      secondPoint = Math.abs(objectRot) > 0.7  ? {x: 1.75,y: -0.5} : {x: -1.75,y: -0.5}
      thirdPoint = Math.abs(objectRot) > 0.7  ? {x: 2.25,y: -0.5} : {x: -2.25,y: -0.5}
      textPosX = Math.abs(objectRot) > 0.7 ? 0.1  : -1.6
      textPosY = - 0.075
      message = "3D ARTIST"
    break;
    case "aboutMe":
      origin = {x: 0,y: -1} 
      secondPoint = Math.abs(objectRot) > 0.5 ? {x: 1,y: -1.5} : {x: -1,y: -1.5}
      thirdPoint = Math.abs(objectRot) > 0.5 ? {x: 1.5,y: -1.5} : {x: -1.5,y: -1.5}
      textPosX = Math.abs(objectRot) > 0.5 ? 0.1  : -1.5
      textPosY = - 0.075
      message = "ABOUT ME"
    break;      
  } 


  let path = new THREE.Path();

  path.currentPoint.x = origin.x
  path.currentPoint.y = origin.y
  path.lineTo(secondPoint.x, secondPoint.y)
  path.lineTo(thirdPoint.x, thirdPoint.y)

  let points = path.getPoints()

  let geometry = new THREE.BufferGeometry().setFromPoints( points )
  let material = new THREE.LineBasicMaterial( { color: 0xffffff } )

  let font_shapes = font.generateShapes( message, 0.2 );
  let font_geometry = new THREE.ShapeBufferGeometry( font_shapes );

  return (
    <group>    
      <line geometry={geometry} material={material}></line>
      <mesh geometry={font_geometry} material={material} position={ [thirdPoint.x + textPosX, thirdPoint.y+textPosY, 0]}></mesh>
    </group>
  )
 }
}

export default function Model({ mouse, ...props }) {
    const group = useRef()
    const { nodes, animations, materials } = useLoader(GLTFLoader, "/assets/head.gltf")
    var font = useLoader(THREE.FontLoader, "/assets/fonts/roboto_mono_bold.json")
    //console.log(nodes)
    
    const cutline_material_transparent = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.15});
    const cutline_material_hovered = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 1});
    const invisible_material = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0});

    const brain_hovered = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2,wireframe:true,})
    const brain_mat = new THREE.MeshBasicMaterial({color:0x6cbbe2,wireframe:true})
    const brain_int_mat = new THREE.MeshLambertMaterial({color: 0x3149, transparent: true, opacity: 0.75});
    const brain_ux = new THREE.MeshLambertMaterial({color: 0x8293a,emissive:0x624396, wireframe:true});
    const brain_frontend = new THREE.MeshLambertMaterial({color: 0x8293a,emissive:0x964343, wireframe:true});
    const brain_graphic = new THREE.MeshLambertMaterial({color: 0x8293a,emissive:0x439646, wireframe:true});
    const brain_3d = new THREE.MeshLambertMaterial({color: 0x8293a,emissive:0x8f9643, wireframe:true});
    const brain_aboutMe = new THREE.MeshLambertMaterial({color: 0x8293a,emissive:0x969696,wireframe:true});

    const actions = useRef()
    const [mixer] = useState(() => new THREE.AnimationMixer())

    let brainMode = false

    useFrame((state, delta) => {
      if(props.brainMode){
        if(props.brainHover === "no_hover"){
        group.current.children.map(item => item.rotation.y = item.rotation.y -= 0.015)
      } 
      }
      else if(props.isHeadCut){
        group.current.children[4].visible = false;
        group.current.children[5].visible = true;
        group.current.children[6].visible = true;
        group.current.children[7].visible = false;
        group.current.children[8].visible = false;
        mixer.update(delta)
      } else {
        group.current.children[4].visible = true;
        group.current.children[5].visible = false;
        group.current.children[6].visible = false;
        group.current.children[7].visible = true;
        group.current.children[8].visible = true;
        moveHead(mouse, group.current)
      }
    })

    useEffect(() => {
      var actions = [
        mixer.clipAction(animations[0], group.current.children[0]),
        mixer.clipAction(animations[3], group.current.children[1]),
        mixer.clipAction(animations[1], group.current.children[2]),
        mixer.clipAction(animations[4], group.current.children[3]),
        mixer.clipAction(animations[5], group.current.children[5]),
        mixer.clipAction(animations[2], group.current.children[6]),
        mixer.clipAction(animations[6], group.current.children[13]),
        mixer.clipAction(animations[7], group.current.children[10]),
        mixer.clipAction(animations[8], group.current.children[11]),
        mixer.clipAction(animations[9], group.current.children[9]),
        mixer.clipAction(animations[10], group.current.children[12]),
        mixer.clipAction(animations[11], group.current.children[14])
      ];

      actions.map((clip) => {
        clip.setLoop(THREE.LoopOnce)
        clip.clampWhenFinished = true;
        clip.play()
      })

      mixer.addEventListener('finished',() =>{ 
        props.setBrainMode()
      })

      return () => actions.forEach(clip => mixer.uncacheClip(clip))
    }, [])

    return (
        <Suspense fallback={null}>
            <group ref={group} {...props} dispose={null} >
            {!props.brainMode ? <mesh visible geometry={nodes["eye_left"].geometry} material={nodes["eye_left"].material} position={nodes["eye_left"].position} scale={nodes["eye_left"].scale}/> : ""}
            {!props.brainMode ? <mesh visible geometry={nodes["eye_left_lid"].geometry} material={nodes["eye_left_lid"].material} position={nodes["eye_left_lid"].position} scale={nodes["eye_left_lid"].scale}/>: ""}
            {!props.brainMode ? <mesh visible geometry={nodes["eye_right"].geometry} material={nodes["eye_right"].material} position={nodes["eye_right"].position} scale={nodes["eye_right"].scale}/>: ""}
            {!props.brainMode ? <mesh visible geometry={nodes["eye_right_lid"].geometry} material={nodes["eye_right_lid"].material} position={nodes["eye_right_lid"].position} scale={nodes["eye_right_lid"].scale}/>: ""}
            {!props.brainMode ? <mesh visible geometry={nodes["head_mesh"].geometry} material={nodes["head_mesh"].material} position={nodes["head_mesh"].position} scale={nodes["head_mesh"].scale}/> : ""}
            {!props.brainMode ? <mesh visible geometry={nodes["head_mesh_up"].geometry} material={nodes["head_mesh_up"].material} position={nodes["head_mesh_up"].position} scale={nodes["head_mesh_up"].scale}/>: ""}
            {!props.brainMode ? <mesh visible geometry={nodes["head_mesh_down"].geometry} material={nodes["head_mesh_down"].material} position={nodes["head_mesh_down"].position} scale={nodes["head_mesh_down"].scale}/> : ""}
            {!props.brainMode ? <mesh 
                visible 
                geometry={nodes["cutline"].geometry} 
                material={props.cutlineHovered  ? cutline_material_hovered : cutline_material_transparent } 
                position={nodes["cutline"].position} 
                scale={nodes["cutline"].scale}
                />: ""}
            {!props.brainMode ? <mesh 
                visible 
                geometry={nodes["cutline_hoverzone"].geometry} 
                material={invisible_material} 
                onPointerOver={e => {props.setCutlineHovered(e);e.stopPropagation()}}
                onPointerOut={e => {props.setCutlineHovered(e);e.stopPropagation()}}
                onClick={props.setCutHead}
                position={nodes["cutline_hoverzone"].position} 
                scale={nodes["cutline_hoverzone"].scale}
                />: ""}
                <mesh visible geometry={nodes["brain_ux"].geometry} material={props.brainHover === "ux" ? brain_hovered : brain_mat} position={nodes["brain_ux"].position} scale={nodes["brain_ux"].scale} onPointerMove={e => {props.setBrainHover(e, "ux");e.stopPropagation()}} onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}} />              
                <mesh visible geometry={nodes["brain_frontend"].geometry} material={props.brainHover === "frontend" ? brain_hovered : brain_mat} position={nodes["brain_frontend"].position} scale={nodes["brain_frontend"].scale} onPointerMove={e => {props.setBrainHover(e,"frontend");e.stopPropagation()}} onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}/>   
                <mesh visible geometry={nodes["brain_graphic"].geometry} material={props.brainHover === "graphic" ? brain_hovered : brain_mat} position={nodes["brain_graphic"].position} scale={nodes["brain_graphic"].scale} onPointerMove={e => {props.setBrainHover(e,"graphic");e.stopPropagation()}} onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}/>   
                <mesh visible geometry={nodes["brain_3d"].geometry} material={props.brainHover === "3d" ? brain_hovered : brain_mat} position={nodes["brain_3d"].position} scale={nodes["brain_3d"].scale} onPointerMove={e => {props.setBrainHover(e,"3d");e.stopPropagation()}} onPointerOut={e => {props.setBrainHover(e, "no_hover");e.stopPropagation()}}/>   
                <mesh visible geometry={nodes["brain_aboutMe"].geometry} material={props.brainHover === "aboutMe" ? brain_hovered : brain_mat} position={nodes["brain_aboutMe"].position} scale={nodes["brain_aboutMe"].scale} onPointerMove={e => {props.setBrainHover(e,"aboutMe");e.stopPropagation()}} onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}/>   
                <mesh visible geometry={nodes["brain_interior"].geometry} material={brain_int_mat} position={nodes["brain_interior"].position} scale={nodes["brain_interior"].scale}/>
             </group>
             {props.brainHover != "no_hover" && props.brainMode ? line(props.brainHoverEvent,props.brainHover,font) : ""}
        </Suspense>
    )

  }
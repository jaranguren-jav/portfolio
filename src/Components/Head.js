import * as THREE from "three"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { moveHead, access_granted } from "../utils"
import Loading from "./Loading"
import Effects from "./Effects"

export default function Head({ mouse, ...props }) {
    //Group definition
    const group = useRef()
    // Gltf Model and font loading hooks
    const { nodes, animations } = useLoader(GLTFLoader, "/assets/head.gltf")
    const font = useLoader(THREE.FontLoader, "/assets/fonts/roboto_mono_bold.json")
    let wireframe_alpha = useLoader(THREE.TextureLoader, "/assets/wireframe_alpha.png")
    let head_alpha = useLoader(THREE.TextureLoader, "/assets/head_alpha.png")
    const [animationGlitch, setAnimatioGlitch] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);

    //Materials

    const cutline_material = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2, transparent: true});
    props.cutlineHovered  ? cutline_material.setValues({opacity: 1}) : cutline_material.setValues({opacity: 0.05})
    const invisible_material = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0});
    const brain_hovered = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2,wireframe:true,})
    const brain_mat = new THREE.MeshBasicMaterial({color:0x39898f,wireframe:true})
    const brain_int_mat = new THREE.MeshLambertMaterial({color: 0x3149, transparent: true, opacity: 0.75});
    nodes["head_mesh"].material.setValues({transparent: true,alphaMap:head_alpha})
    let head_mat = nodes["head_mesh"].material
    const head_wireframe = new THREE.MeshLambertMaterial({color:0x6cbbe2,emissive:0xa6edf2,wireframe:true,transparent: true,opacity: 0.15,alphaMap:wireframe_alpha})

    //Animation mixer definition
    const [mixer] = useState(() => new THREE.AnimationMixer())

    useFrame((state, delta) => {
      //If "Brain Mode" activated, rotate the Brain
      if(props.brainMode){
        setAnimatioGlitch(false)
        setAccessGranted(false)
        if(props.brainHover === "no_hover"){group.current.children.map(item => item.rotation.y = item.rotation.y -= 0.015)} 
      //Else if the cutline is clicked make the cutline dissapear and activate the main animation 
      } else if(props.isHeadCut){
        setAnimatioGlitch(true)
        setAccessGranted(true)
        group.current.children[4].visible = false;
        group.current.children[5].visible = true;
        group.current.children[6].visible = true;
        group.current.children[7].visible = false;
        group.current.children[8].visible = false;
        group.current.children[9].visible = true;
        group.current.children[10].visible = true;
        group.current.children[11].visible = true;
        group.current.children[12].visible = true;
        group.current.children[13].visible = true;
        group.current.children[14].visible = true;
        group.current.children[15].visible = true;
        mixer.update(delta)
      //Else show everything and keep the moving head animation
      } else {
        props.cutlineHovered  ? setAnimatioGlitch(true) : setAnimatioGlitch(false) 
        group.current.children[4].visible = true;
        group.current.children[5].visible = false;
        group.current.children[6].visible = false;
        group.current.children[7].visible = true;
        group.current.children[8].visible = true;
        group.current.children[9].visible = false;
        group.current.children[10].visible = false;
        group.current.children[11].visible = false;
        group.current.children[12].visible = false;
        group.current.children[13].visible = false;
        group.current.children[14].visible = false;
        moveHead(mouse, group.current)
      }
    })

    useEffect(() => {
      //Set every animation to it's corresponding root object
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
      //Setting the animations propierties
      actions.forEach((clip) => {
        clip.setLoop(THREE.LoopOnce)
        clip.clampWhenFinished = true;
        clip.play()
      })
      //When the action is finished it switch to the "Brain Mode"
      mixer.addEventListener('finished',() =>{ 
        props.setBrainMode()
      })
      //Finally all the clips are uncached
      return () => actions.forEach(clip => mixer.uncacheClip(clip))
    }, [])

    return (
      <group ref={group} {...props} dispose={null} >
        <Suspense fallback={<Loading/>}>
          {!props.brainMode ? <mesh geometry={nodes["eye_left"].geometry} material={nodes["eye_left"].material} position={nodes["eye_left"].position} />:""}
          {!props.brainMode ? <mesh geometry={nodes["eye_left_lid"].geometry} material={nodes["eye_left_lid"].material} position={nodes["eye_left_lid"].position}/>: ""}
          {!props.brainMode ? <mesh geometry={nodes["eye_right"].geometry} material={nodes["eye_right"].material} position={nodes["eye_right"].position}/>: ""}
          {!props.brainMode ? <mesh geometry={nodes["eye_right_lid"].geometry} material={nodes["eye_right_lid"].material} position={nodes["eye_right_lid"].position}/>: ""}
          {!props.brainMode ? <mesh geometry={nodes["head_mesh"].geometry} material={head_mat} position={nodes["head_mesh"].position}>
              <mesh geometry={nodes["head_mesh"].geometry} material={head_wireframe} position={nodes["head_mesh"].position}></mesh>
          </mesh> : ""}
          {!props.brainMode ? <mesh geometry={nodes["head_mesh_up"].geometry} material={head_mat} position={nodes["head_mesh_up"].position}>
               <mesh geometry={nodes["head_mesh_up"].geometry} material={head_wireframe} position={nodes["head_mesh_up"].position}/>
          </mesh>: ""}
          {!props.brainMode ? <mesh geometry={nodes["head_mesh_down"].geometry} material={head_mat} position={nodes["head_mesh_down"].position}>
                <mesh geometry={nodes["head_mesh_down"].geometry} material={head_wireframe} position={nodes["head_mesh_down"].position}/>
          </mesh> : ""}
          {!props.brainMode ? <mesh geometry={nodes["cutline"].geometry} material={cutline_material} position={nodes["cutline"].position}/>: ""}
          {!props.brainMode ? <mesh geometry={nodes["cutline_hoverzone"].geometry} material={invisible_material} position={nodes["cutline_hoverzone"].position}
              onPointerOver={e => {props.setCutlineHovered(e);e.stopPropagation()}}
              onPointerOut={e => {props.setCutlineHovered(e);e.stopPropagation()}}
              onClick={props.setCutHead}
          />: ""}
          <mesh visible geometry={nodes["brain_ux"].geometry} material={props.brainHover === "UX / UI" ? brain_hovered : brain_mat} position={nodes["brain_ux"].position}
            onPointerMove={e => {if(props.brainMode) props.setBrainHover(e, "UX / UI");e.stopPropagation()}} 
            onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}
            onClick={e=>{if(props.brainMode) props.newWindow("ux_ui");e.stopPropagation()}}
            />              
          <mesh visible geometry={nodes["brain_frontend"].geometry} material={props.brainHover === "FRONT-END DEVELOPER" ? brain_hovered : brain_mat} position={nodes["brain_frontend"].position}
            onPointerMove={e => {if(props.brainMode)  props.setBrainHover(e,"FRONT-END DEVELOPER");e.stopPropagation()}}
            onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}
            onClick={e=>{if(props.brainMode) props.newWindow("front_end");e.stopPropagation()}}
            />   
          <mesh visible geometry={nodes["brain_graphic"].geometry} material={props.brainHover === "GRAPHIC DESIGN" ? brain_hovered : brain_mat} position={nodes["brain_graphic"].position}
            onPointerMove={e => {if(props.brainMode) props.setBrainHover(e,"GRAPHIC DESIGN");e.stopPropagation()}}
            onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}
            onClick={e=>{if(props.brainMode) props.newWindow("graphic");e.stopPropagation()}}
            />   
          <mesh visible geometry={nodes["brain_3d"].geometry} material={props.brainHover === "3D ARTIST" ? brain_hovered : brain_mat} position={nodes["brain_3d"].position}
            onPointerMove={e => {if(props.brainMode) props.setBrainHover(e,"3D ARTIST");e.stopPropagation()}}
            onPointerOut={e => {props.setBrainHover(e, "no_hover");e.stopPropagation()}}
            onClick={e=>{if(props.brainMode) props.newWindow("3d");e.stopPropagation()}}
            />   
          <mesh visible geometry={nodes["brain_aboutMe"].geometry} material={props.brainHover === "ABOUT ME" ? brain_hovered : brain_mat} position={nodes["brain_aboutMe"].position}
            onPointerMove={e => {if(props.brainMode) props.setBrainHover(e,"ABOUT ME");e.stopPropagation()}}
            onPointerOut={e => {props.setBrainHover(e,"no_hover");e.stopPropagation()}}
            onClick={e=>{if(props.brainMode) props.newWindow("about");e.stopPropagation()}}
            />   
          <mesh visible geometry={nodes["brain_interior"].geometry} material={brain_int_mat} position={nodes["brain_interior"].position}/>
        </Suspense>
        {accessGranted ? access_granted(font) : ""}
        <Effects animationGlitch={animationGlitch} glitchIntensity={props.cutlineHovered  ? 0.005 : 0.05} bloomLvl={0.4}/> 
      </group>
    )
}
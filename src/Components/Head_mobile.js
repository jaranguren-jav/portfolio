import * as THREE from "three"
import React, { Suspense, useEffect, useRef, useState, useContext } from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { access_granted } from "../utils"
import Loading from "./Loading"
import Effects from "./Effects"
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import lerp from "lerp"



export default function Head_mobile({ rotation, ...props }) {
    //Group definition
    const group = useRef()
    const brain = useRef()
    // Gltf Model and font loading hooks
    const { nodes, animations } = useLoader(GLTFLoader, "./assets/head.gltf")
    const font = useLoader(THREE.FontLoader, "./assets/fonts/roboto_mono_bold.json")
    let wireframe_alpha = useLoader(THREE.TextureLoader, "./assets/wireframe_alpha.png")
    let head_alpha = useLoader(THREE.TextureLoader, "./assets/head_alpha.png")
    const [animationGlitch, setAnimatioGlitch] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    var dummy = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    var controls = new DeviceOrientationControls( dummy );
    var yAngle = 0
    var Old_yAngle = 0
    var xAngle = 0
    var Old_xAngle = 0

    //Materials

    const cutline_material = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xa6edf2, transparent: true});
    props.cutlineHovered  ? cutline_material.setValues({opacity: 1}) : cutline_material.setValues({opacity: 0.05})
    const invisible_material = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0});
    const brain_hovered = new THREE.MeshLambertMaterial({color:0x8293a,emissive:0xffffff,wireframe:true,})
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
        brain.current.children.map(item => item.rotation.y = item.rotation.y -= 0.015)
      } else if(props.isHeadGlued){
          setAnimatioGlitch(true)
          setAccessGranted(true)
          brain.current.children.map(item => item.rotation.y = 0)
          group.current.rotation.y = 0
          group.current.rotation.x = 0
          mixer._actions.forEach((clip) => {
            clip.paused = false;
            clip.setLoop(THREE.LoopOnce);      
            clip.timeScale = -1;
            clip.clampWhenFinished = true;
            clip.play();
          }) 
          mixer.update(delta)
        //Else if the cutline is clicked make the cutline dissapear and activate the main animation 
      } else if(props.isHeadCut){
        setAnimatioGlitch(true)
        setAccessGranted(true)
        group.current.children[4].visible = false
        group.current.children[7].visible = false
        group.current.children[8].visible = false
        brain.current.children.forEach(children => children.visible = true)
        //Setting the animations propierties
        mixer._actions.forEach((clip) => {
          clip.paused = false;
          clip.setLoop(THREE.LoopOnce)
          clip.timeScale = 1;
          clip.clampWhenFinished = true;
          clip.play()
        })
        mixer.update(delta)
      //Else show everything and keep the moving head animation
      } else {
        group.current.children.forEach(children => children.visible = true)
        brain.current.children.forEach(children => children.visible = false)

        controls.update()

        var yDifference
        var xDifference

        Old_yAngle = yAngle
        Old_xAngle = xAngle

        if (THREE.MathUtils.radToDeg(dummy.rotation.y) < 0){
           yAngle = 360 + THREE.MathUtils.radToDeg(dummy.rotation.y)
        } else {
          yAngle = THREE.MathUtils.radToDeg(dummy.rotation.y) 
        }

        if (THREE.MathUtils.radToDeg(dummy.rotation.x) < 0){
          xAngle = 360 + THREE.MathUtils.radToDeg(dummy.rotation.x)
       } else {
         xAngle = THREE.MathUtils.radToDeg(dummy.rotation.x) 
       }

        yDifference = Old_yAngle - yAngle
        xDifference = Old_xAngle - xAngle

        Old_yAngle = yAngle
        Old_xAngle = xAngle

        var yObject
        var xObject

        if (THREE.MathUtils.radToDeg(group.current.rotation.y) < 0){
          yObject = 360 + THREE.MathUtils.radToDeg(group.current.rotation.y)
        } else {
          yObject = THREE.MathUtils.radToDeg(group.current.rotation.y) 
        }

        if (THREE.MathUtils.radToDeg(group.current.rotation.x) < 0){
          xObject = 360 + THREE.MathUtils.radToDeg(group.current.rotation.x)
        } else {
          xObject = THREE.MathUtils.radToDeg(group.current.rotation.x) 
        }

        var new_rotation_y = yObject + yDifference
        var new_rotation_x = xObject + xDifference

        var offset_y = 0
        var offset_x = 0

        var resetValue_y = null
        var resetValue_x = null

        if(new_rotation_y > 10 && new_rotation_y < 345){
          yDifference=0
          if(new_rotation_y > 180){
            resetValue_y = 346
          }else if(new_rotation_y < 180){
            resetValue_y = 9
          }         
        } else if(new_rotation_y > 360){
          offset_y = 360
        } 

        
        if(new_rotation_x > 10 && new_rotation_x < 345){
          xDifference=0
          if(new_rotation_x > 180){
            resetValue_x = 346
          }else if(new_rotation_x < 180){
            resetValue_x = 9
          }         
        } else if(new_rotation_x > 360){
          offset_x = 360
        } 


        var radianDifference_y = THREE.MathUtils.degToRad(yObject + yDifference - offset_y)
        var radianDifference_x = THREE.MathUtils.degToRad(xObject + xDifference - offset_x)

        if(resetValue_y != null){
          group.current.rotation.y  = THREE.MathUtils.degToRad(resetValue_y)
        } else {
          group.current.rotation.y  =+ radianDifference_y  
        }

        if(resetValue_x != null){
          group.current.rotation.x  = THREE.MathUtils.degToRad(resetValue_x)
        } else {
          group.current.rotation.x  =+ radianDifference_x  
        }
        
        resetValue_y = null
        resetValue_x = null

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
        mixer.clipAction(animations[6], brain.current.children[4]),
        mixer.clipAction(animations[7], brain.current.children[1]),
        mixer.clipAction(animations[8], brain.current.children[2]),
        mixer.clipAction(animations[9], brain.current.children[0]),
        mixer.clipAction(animations[10], brain.current.children[3]),
        mixer.clipAction(animations[11], brain.current.children[5])
      ];

      //When the action is finished it switch to the "Brain Mode"
      mixer.addEventListener('finished',() =>{ 
        props.animationFinish()
        setAnimatioGlitch(false)
        setAccessGranted(false)
      })
      //Finally all the clips are uncached
      return () => actions.forEach(clip => mixer.uncacheClip(clip))
    }, [])

    return (
      <group>
        <Suspense fallback={<Loading/>}>
          <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes["eye_left"].geometry} material={nodes["eye_left"].material} position={nodes["eye_left"].position} />:""}
            <mesh geometry={nodes["eye_left_lid"].geometry} material={nodes["eye_left_lid"].material} position={nodes["eye_left_lid"].position}/>: ""}
            <mesh geometry={nodes["eye_right"].geometry} material={nodes["eye_right"].material} position={nodes["eye_right"].position}/>: ""}
            <mesh geometry={nodes["eye_right_lid"].geometry} material={nodes["eye_right_lid"].material} position={nodes["eye_right_lid"].position}/>: ""}
            <mesh geometry={nodes["head_mesh"].geometry} material={head_mat} position={nodes["head_mesh"].position}>
                <mesh geometry={nodes["head_mesh"].geometry} material={head_wireframe} position={nodes["head_mesh"].position}></mesh>
            </mesh> : ""}
            <mesh geometry={nodes["head_mesh_up"].geometry} material={head_mat} position={nodes["head_mesh_up"].position}>
                <mesh geometry={nodes["head_mesh_up"].geometry} material={head_wireframe} position={nodes["head_mesh_up"].position}/>
            </mesh>
            <mesh geometry={nodes["head_mesh_down"].geometry} material={head_mat} position={nodes["head_mesh_down"].position}>
                  <mesh geometry={nodes["head_mesh_down"].geometry} material={head_wireframe} position={nodes["head_mesh_down"].position}/>
            </mesh>
            {!props.brainMode & !props.isHeadGlued ? <mesh geometry={nodes["cutline"].geometry} material={cutline_material} position={nodes["cutline"].position}/>: ""}
            {!props.brainMode & !props.isHeadGlued ? <mesh geometry={nodes["cutline_hoverzone"].geometry} material={invisible_material} position={nodes["cutline_hoverzone"].position}/>: ""}
          </group>
          <group ref={brain} {...props} dispose={null}>
            <mesh visible geometry={nodes["brain_ux"].geometry} material={props.brainHover === "UX / UI" ? brain_hovered : brain_mat} position={nodes["brain_ux"].position}/>              
            <mesh visible geometry={nodes["brain_frontend"].geometry} material={props.brainHover === "FRONT-END DEVELOPER" && props.brainMode ? brain_hovered : brain_mat} position={nodes["brain_frontend"].position}/>   
            <mesh visible geometry={nodes["brain_graphic"].geometry} material={props.brainHover === "GRAPHIC DESIGN" ? brain_hovered : brain_mat} position={nodes["brain_graphic"].position}/>   
            <mesh visible geometry={nodes["brain_3d"].geometry} material={props.brainHover === "VISUAL ARTIST" ? brain_hovered : brain_mat} position={nodes["brain_3d"].position}/>   
            <mesh visible geometry={nodes["brain_aboutMe"].geometry} material={props.brainHover === "ABOUT ME" ? brain_hovered : brain_mat} position={nodes["brain_aboutMe"].position}/>   
            <mesh visible geometry={nodes["brain_interior"].geometry} material={brain_int_mat} position={nodes["brain_interior"].position}/>
            {accessGranted && props.isHeadCut ? access_granted(font,true) : accessGranted && props.isHeadGlued? access_granted(font,false) : ""}
          </group>
        </Suspense>
      <Effects animationGlitch={animationGlitch} glitchIntensity={props.cutlineHovered  ? 0.005 : 0.05} bloomLvl={0.4}/> 
      </group>
    )
}
import * as THREE from "three"
import React from "react"
import lerp from "lerp"

export function access_granted(font,state){
  //Creates the geometry for the text
  let font_shapes
  if(state){
    font_shapes = font.generateShapes( "ACCESS GRANTED", 0.2 );
  } else {
    font_shapes = font.generateShapes( "BYE, THANKS!", 0.2 );
  }
  let font_geometry = new THREE.ShapeBufferGeometry( font_shapes );
  let plane_geometry = new THREE.PlaneBufferGeometry( 3, 0.5, 1 )

  //Creates the material
  let font_material = new THREE.LineBasicMaterial( { color: 0xffffff } )
  let plane_material = new THREE.MeshBasicMaterial( { color: 0x000000 } )

  return (
    <group scale={[0.5,0.5,0.5]} position={ [-0.55, 0, 2]}>    
      <mesh geometry={font_geometry} material={font_material}></mesh>
      <mesh geometry={plane_geometry} material={plane_material} position={ [1, 0.1, -0.05]}></mesh>
    </group>
  )
}

export function line(event, hoveredItem,font){
  //If hover event is fired 
  if(event.eventObject){

  let origin // Sets the origin point for the line
  let secondPoint // Sets the elbow point of the line
  let thirdPoint // Sets the final point of the line
  let objectRot = event.eventObject.quaternion._w //Gets the object rotation
  let message // Defines the text to show
  let textPosX  // Defines the text X position
  let textPosY = 0 // Defines the text Y position

  //Depending on the "hoveredItem" and it's rotation or "objectRot", defines the line and text propierties
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
      origin = {x: 0,y: -0.5} 
      secondPoint = Math.abs(objectRot) > 0.5 ? {x: 1,y: -1.5} : {x: -1,y: -1.5}
      thirdPoint = Math.abs(objectRot) > 0.5 ? {x: 1.5,y: -1.5} : {x: -1.5,y: -1.5}
      textPosX = Math.abs(objectRot) > 0.5 ? 0.1  : -1.5
      textPosY = - 0.075
      message = "ABOUT ME"
    break;
    default:
    break;      
  } 

  //Creates a new path
  let path = new THREE.Path();

  //Defines the line path
  path.currentPoint.x = origin.x
  path.currentPoint.y = origin.y
  path.lineTo(secondPoint.x, secondPoint.y)
  path.lineTo(thirdPoint.x, thirdPoint.y)
  let points = path.getPoints()

  //Sets the geometry and material for the line
  let geometry = new THREE.BufferGeometry().setFromPoints( points )

  //Creates the geometry for the text
  let font_shapes = font.generateShapes( message, 0.2 );
  let font_geometry = new THREE.ShapeBufferGeometry( font_shapes );

  //Creates the material
  let material = new THREE.LineBasicMaterial( { color: 0xffffff } )

  return (
    <group scale={[0.5,0.5,0.5]}>    
      <line geometry={geometry} material={material}></line>
      <mesh geometry={font_geometry} material={material} position={ [thirdPoint.x + textPosX, thirdPoint.y+textPosY, 0]}></mesh>
    </group>
  )
 }
}

export function moveHead(mouse, group) {
  //Sets the movement for the head group
  let degrees = getMouseDegrees(mouse.x, mouse.y, 20)
  group.rotation.xD = lerp(group.rotation.xD || 0, degrees.y, 0.1)
  group.rotation.yD = lerp(group.rotation.yD || 0, degrees.x, 0.1)
  group.rotation.x = THREE.Math.degToRad(group.rotation.xD)
  group.rotation.y = THREE.Math.degToRad(group.rotation.yD)
  if(group.children.length > 2){
    //Sets the movement for the eyes
    let eyes = [group.children[0],group.children[1],group.children[2],group.children[3]]
    eyes.forEach((item) => {
        item.rotation.xD = lerp(item.rotation.xD || 0, degrees.y, 0.2)
        item.rotation.yD = lerp(item.rotation.yD || 0, degrees.x, 0.2)
        item.rotation.x = THREE.Math.degToRad(item.rotation.xD)
        item.rotation.y = THREE.Math.degToRad(item.rotation.yD)
    })
  } 
}

export function getMousePos(e) 
{
  return { x: e.clientX, y: e.clientY }
}
  
export function getMouseDegrees(x, y, degreeLimit) 
{
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage
  
    let w = { x: window.innerWidth, y: window.innerHeight }
  
    // Left (Rotates neck left between 0 and -degreeLimit)
    // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
      // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1
    }
  
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2
      xPercentage = (xdiff / (w.x / 2)) * 100
      dx = (degreeLimit * xPercentage) / 100
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y
      yPercentage = (ydiff / (w.y / 2)) * 100
      // Note that I cut degreeLimit in half when she looks up
      dy = ((degreeLimit/5 * 0.5 * yPercentage) / 100) * -1
    }
    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2
      yPercentage = (ydiff / (w.y / 2)) * 100
      dy = (degreeLimit * yPercentage) / 100
    }
    return { x: dx, y: dy }
}
  
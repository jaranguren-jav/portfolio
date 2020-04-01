import * as THREE from "three"
import React, { useRef, useState, Suspense, useCallback, useMemo, Component } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import Head from "./Head"
import Cursor from "./Cursor"
import './App.css';

class App extends Component {

constructor(props) {
  super(props)
  this.state = {
    d: 8.25,
    mouse : {x:0,y:0},
    mouseOut:false,
    clicked:false,
    cutlineHovered:false,
    headIsCut:false,
    brainMode:false,
    brainHover:"no_hover",
    brainHoverEvent:{}
  }
  this.mouseMove = this.mouseMove.bind(this);
  this.mouseLeave = this.mouseLeave.bind(this);
  this.mouseEnter = this.mouseEnter.bind(this);
  this.mouseDown = this.mouseDown.bind(this);
  this.mouseUp = this.mouseUp.bind(this);

  this.setCutlineHovered = this.setCutlineHovered.bind(this);
  this.setCutHead = this.setCutHead.bind(this);
  this.setBrainMode = this.setBrainMode.bind(this);
  this.setBrainHover = this.setBrainHover.bind(this);
}

mouseMove(e){
  this.setState({mouse: {x:e.clientX,y:e.clientY}})
}

mouseLeave(e){
  this.setState({mouseOut:true})
}

mouseEnter(e){
  this.setState({mouseOut:false})
  this.setState({clicked:true})
}

mouseDown(e){
  this.setState({clicked:true})
}

mouseUp(e){
  this.setState({clicked:false})
}

setCutlineHovered(e){
  this.setState({clicked:false})
  this.setState({cutlineHovered:(e.type === "pointerover" ? true : false )})
}

setCutHead(){
  this.setState({headIsCut:true})
}

setBrainMode(){
  this.setState({brainMode:true})
}

setBrainHover(e, hoveredItem){
    this.setState({brainHover:hoveredItem}) 
    this.setState({brainHoverEvent:e}) 
}


render() {
  return (
    <div className="App" onMouseMove={this.mouseMove} onMouseLeave={this.mouseLeave} onMouseEnter={this.mouseEnter} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>
        {this.state.mouseOut ? "" : <Cursor mouse={this.state.mouse} clicked={this.state.clicked} scissorCursor={this.state.cutlineHovered}/>}
        <Canvas shadowMap pixelRatio={window.devicePixelRatio} camera={{fov: 40,position: [0, 0, 7]}}>
          <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
          <hemisphereLight skyColor={"black"} groundColor={0xffffff} intensity={0.8} position={[0, 50, 0]} />
          <directionalLight
            position={[-8, 12, 8]}
            shadow-camera-left={this.state.d * -1}
            shadow-camera-bottom={this.state.d * -1}
            shadow-camera-right={this.state.d}
            shadow-camera-top={this.state.d}
            shadow-camera-near={0.1}
            shadow-camera-far={1500}
            castShadow
          />
          <Suspense fallback={null}>
            <Head 
              mouse={this.state.mouse} 
              position={[0, -0.25, 0]} 
              scale={[2,2,2]} 
              setCutlineHovered={this.setCutlineHovered} 
              cutlineHovered={this.state.cutlineHovered} 
              setCutHead={this.setCutHead} 
              isHeadCut={this.state.headIsCut}
              setBrainMode={this.setBrainMode}
              brainMode={this.state.brainMode}
              setBrainHover={this.setBrainHover}
              brainHover={this.state.brainHover}
              brainHoverEvent={this.state.brainHoverEvent}
            /> 
          </Suspense>
        </Canvas>,
    </div>
  );
}
}

export default App;

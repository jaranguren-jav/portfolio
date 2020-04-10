import React, { Suspense, Component } from 'react'
import { Canvas} from 'react-three-fiber'
import Head from "./Components/Head"
import Loading from "./Components/Loading"
import Cursor from "./Components/cursor_component/Cursor"
import Particles from "./Components/Particles"
import Window from "./Components/window_component/Window"
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props)
    
    //State
    this.state = {
      isMobile : /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      d: 8.25,
      mouse : {x:0,y:0},
      mouseOut:false,
      clicked:false,
      cutlineHovered:false,
      headIsCut:false,
      brainMode:false,
      brainHover:"no_hover",
      brainClick:"no_click",
      brainHoverEvent:{},
      font:{},
      down:false,
      bloomLvl:0.1,
      windows:[],
      window_active:null,
      width: 0,
      height: 0,
    }

    //Model mouse Events
    this.setCutlineHovered = this.setCutlineHovered.bind(this);
    this.setBrainHover = this.setBrainHover.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.newWindow = this.newWindow.bind(this);

    //Get Window size
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  setCutlineHovered(e){
    this.setState({clicked:false})
    this.setState({cutlineHovered:(e.type === "pointerover" ? true : false )})
  }

  setBrainHover(e, hoveredItem){
      this.setState({brainHover:hoveredItem}) 
      this.setState({brainHoverEvent:e}) 
  }

  closeWindow(key){
    let array = this.state.windows
    array = array.filter((item, index) => index !== key)
    this.setState({windows:array}) 
  }

  newWindow(type){
    let array = this.state.windows
    array.push(type)
    this.setState({window_active:this.state.windows.length - 1}) 
    this.setState({windows:array}) 
  }

  render() {
    return (
      <div className="App">
          <div className="presentation">
            <div>HI! I'M <i>JULEN ARANGUREN</i></div>
            <div>AND THIS IS MY <i>DIGITAL SELF</i></div>
          </div>
          <div className="links">
            <a href={"https://www.linkedin.com/in/julen-aranguren-a28a8611a"} target="_blank" className="links_linkedIn"></a>
            <div className="links_mailTo" onClick={e=> this.newWindow("contact")}></div>
          </div>
          {this.state.mouseOut ? "" : <Cursor mouse={this.state.mouse} clicked={this.state.clicked} scissorCursor={this.state.cutlineHovered} brainHover={this.state.brainHover} brainMode={this.state.brainMode}/>}
          {this.state.width < 480 ? "" : this.state.windows.length > 0 ? <div className="closeAll" onClick={e => this.setState({windows:[]}) }>Close All</div> : ""}
          {this.state.windows.length > 0 ? this.state.windows.map((type, index) => <Window isMobile={this.state.width < 480 ? true : false} key={index} type={type} number={index} closeWindow={this.closeWindow} setActive={number => this.setState({window_active:number})} isActive={this.state.window_active}/>) : ""}
            <Canvas shadowMap 
            pixelRatio={window.devicePixelRatio}
            camera={{fov: 40,position: [0, 0, 7]}}
            onMouseMove={e => this.setState({mouse: {x:e.clientX,y:e.clientY}})} 
            onMouseLeave={e => this.setState({mouseOut:true})} 
            onMouseEnter={e => {this.setState({mouseOut:false});this.setState({clicked:true})}} 
            onMouseDown={e => this.setState({clicked:true, down:true})} 
            onMouseUp={e => this.setState({clicked:false, down:false})}>
            >
              <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
              <hemisphereLight skyColor={"black"} groundColor={0xffffff} intensity={0.8} position={[0, 50, 0]} />
              <Suspense fallback={<Loading scale={this.state.width < 420 ? "small" : "normal"} />}>
                  <Head 
                    mouse={this.state.mouse} 
                    position={this.state.width < 768 ? [0,0,0] : [0,-0.25,0]} 
                    scale={this.state.width < 420 ? [1.25, 1.25, 1.25] : this.state.width < 768 ? [1.5,1.5,1.5] : [2,2,2]} 
                    setCutlineHovered={this.setCutlineHovered} 
                    cutlineHovered={this.state.cutlineHovered} 
                    setCutHead={e => this.setState({headIsCut:true})} 
                    isHeadCut={this.state.headIsCut}
                    setBrainMode={e => this.setState({brainMode:true})}
                    brainMode={this.state.brainMode}
                    setBrainHover={this.setBrainHover}
                    brainHover={this.state.brainHover}
                    brainHoverEvent={this.state.brainHoverEvent}
                    newWindow={this.newWindow}
                  /> 
              </Suspense>
              <Particles count={this.state.isMobile ? 5000 : 10000} mouse={this.state.mouse} />
            </Canvas>
      </div>
    );
  }
}

export default App;

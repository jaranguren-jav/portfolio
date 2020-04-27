import React, { Suspense, Component } from 'react'
import { Canvas} from 'react-three-fiber'
import Head from "./Components/Head"
import Head_mobile from "./Components/Head_mobile"
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
      mouseOut:false,
      clicked:false,
      cutlineHovered:false,
      headIsCut:false,
      brainMode:false,
      brainHover:"no_hover",
      brainClick:"no_click",
      brainHoverEvent:{},
      headIsGlued:false,
      font:{},
      down:false,
      bloomLvl:0.1,
      windows:[],
      window_active:null,
      width: 0,
      height: 0,
      rotation: null,
      landscape: false,
      startAnim:false,
      selectedBrainPart:["FRONT-END DEVELOPER", "UX / UI", "GRAPHIC DESIGN", "VISUAL ARTIST", "ABOUT ME"],
      navSelectedItem:0
    }

    //Model mouse Events
    this.setCutlineHovered = this.setCutlineHovered.bind(this);
    this.setBrainHover = this.setBrainHover.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.newWindow = this.newWindow.bind(this);

    //Get Window size
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)

    //Animation
    this.animationIsFinished = this.animationIsFinished.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)

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
    this.setState({mouseOut:false})
  }

  newWindow(type){
    let array = this.state.windows
    array.push(type)
    this.setState({window_active:this.state.windows.length - 1}) 
    this.setState({windows:array}) 
  }
  
  animationIsFinished(){
    console.log(this.state.headIsGlued)
    if(this.state.headIsGlued){
      this.setState({headIsGlued:false})
      this.setState({brainMode:false})
    } else if(this.state.headIsCut){
      this.setState({headIsCut:false})
      this.setState({brainMode:true})
    }
  }
  render() {
    return (
      <div className="App">
          {this.state.brainMode ? <div className="back" onClick={e => this.setState({headIsGlued:true, brainMode:false})} style={{cursor: "url(./assets/window_cursors/cursor_pointer.cur), pointer"}}>&larr; Back to the head</div> : ""}
          {this.state.isMobile && !this.state.brainMode? <div className={this.state.headIsCut ? "discover_button fade" :"discover_button"} onClick={e => this.setState({headIsCut:true})}>DISCOVER WHAT'S INSIDE</div> : ""}
          {this.state.isMobile && this.state.brainMode? 
          <div className="mobile">        
            <div className="mobile_navigation">
              <div className="mobile_navigation_arrow" onClick={e => this.setState({navSelectedItem:this.state.navSelectedItem-1 < 0 ? 4 : this.state.navSelectedItem-1})}>&lt;</div>
              <div className="mobile_navigation_button" onClick={e => this.newWindow(this.state.selectedBrainPart[this.state.navSelectedItem])}>{this.state.selectedBrainPart[this.state.navSelectedItem]}</div>
              <div className="mobile_navigation_arrow" onClick={e => this.setState({navSelectedItem:this.state.navSelectedItem+1 === 5 ? 0 : this.state.navSelectedItem+1})}>&gt;</div>         
            </div>
            <div className="mobile_info">Tap to open</div>
          </div>   
           : ""}
          {this.state.isMobile ? 
            <div className="presentation_mobile">HI! I'M <i>JULEN ARANGUREN</i></div>
          : 
          <div className="presentation">
            <div className="presentation_box">HI! I'M <i>JULEN ARANGUREN</i></div>
            <div className="presentation_box">AND THIS IS MY <i>DIGITAL SELF</i></div>
          </div>}
          {!this.state.isMobile ? 
          <div className="links">
            <a href={"https://www.linkedin.com/in/julen-aranguren-a28a8611a"} target="_blank" className="links_linkedIn" style={{backgroundImage: "url(./assets/logo_linkedIn.png)",cursor: "url(./assets/window_cursors/cursor_pointer.cur), pointer"}}></a>
            <div className="links_mailTo" onClick={e=> this.newWindow("contact")} style={{backgroundImage: "url(./assets/logo_mailto.png)", cursor: "url(./assets/window_cursors/cursor_pointer.cur), pointer"}}></div>
          </div> 
          : 
          <div className="mobile_links">
            <a href={"https://www.linkedin.com/in/julen-aranguren-a28a8611a"} target="_blank" className="mobile_links_link" style={{backgroundImage: "url(./assets/logo_linkedIn.png)",backgroundSize:"contain"}}></a>
            <div className="mobile_links_link" onClick={e=> this.newWindow("contact")} style={{backgroundImage: "url(./assets/logo_mailto.png)",backgroundSize:"contain"}}></div>
          </div> 
          }
          {this.state.mouseOut || this.state.isMobile ? "" : <Cursor clicked={this.state.clicked} scissorCursor={this.state.cutlineHovered} brainHover={this.state.brainHover} brainMode={this.state.brainMode}/>}
          {this.state.width < 480 ? "" : this.state.windows.length > 0 ? <div className="closeAll" onClick={e => this.setState({windows:[]}) } style={{cursor: "url(./assets/window_cursors/cursor_pointer.cur), pointer"}}>Close All</div> : ""}
          {this.state.windows.length > 0 ? this.state.windows.map((type, index) => <Window isMobile={this.state.width < 480 ? true : false} key={index} type={type} number={index} closeWindow={this.closeWindow} setActive={number => this.setState({window_active:number})} isActive={this.state.window_active} newWindow={this.newWindow}/>) : ""}
            <Canvas shadowMap 
            pixelRatio={window.devicePixelRatio}
            camera={{fov: 40,position: [0, 0, 7]}}
            onMouseLeave={e => this.setState({mouseOut:true})} 
            onMouseEnter={e => {this.setState({mouseOut:false});this.setState({clicked:true})}} 
            onMouseDown={e => this.setState({clicked:true, down:true})} 
            onMouseUp={e => this.setState({clicked:false, down:false})}>
              <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
              <hemisphereLight skyColor={"black"} groundColor={0xffffff} intensity={0.8} position={[0, 50, 0]} />
              <Suspense fallback={<Loading scale={this.state.width < 420 ? "small" : "normal"} />}>
                  {this.state.isMobile ?
                    <Head_mobile
                    position={[0,0,0]} 
                    scale={this.state.width < 420 ? [1.25, 1.25, 1.25] : this.state.width < 768 ? [1.5,1.5,1.5] : [2,2,2]} 
                    brainMode={this.state.brainMode}
                    brainHover={this.state.selectedBrainPart[this.state.navSelectedItem]}
                    isHeadCut={this.state.headIsCut}
                    isHeadGlued={this.state.headIsGlued}
                    animationFinish = {this.animationIsFinished}
                    /> 
                    : 
                    <Head
                    position={this.state.width < 768 ? [0,0,0] : [0,-0.1,0]} 
                    scale={this.state.width < 420 ? [1, 1, 1] : this.state.width < 768 ? [1.25,1.25,1.25] : [1.35,1.35,1.35]} 
                    setCutlineHovered={this.setCutlineHovered} 
                    cutlineHovered={this.state.cutlineHovered} 
                    setCutHead={e => this.setState({headIsCut:true})} 
                    isHeadCut={this.state.headIsCut}
                    brainMode={this.state.brainMode}
                    setBrainHover={this.setBrainHover}
                    brainHover={this.state.brainHover}
                    brainHoverEvent={this.state.brainHoverEvent}
                    isHeadGlued={this.state.headIsGlued}
                    newWindow={this.newWindow}
                    animationFinish = {this.animationIsFinished}
                    /> 
                  }
              </Suspense>
              <Particles count={this.state.isMobile ? 5000 : 10000}/>
            </Canvas>        
      </div>
    );
  }
}

export default App;

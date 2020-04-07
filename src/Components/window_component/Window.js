import React from "react"
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import "./Window.css"
import * as data from "./content.json"
import {Math as _Math} from "three"

export default function Window({ number, type, isActive, ...props }){
    const content = data.default[type]
    let active = isActive === number ? true : false
    return (
    <Draggable handle=".bar" defaultPosition={{x: window.innerWidth/(2.9 + _Math.randFloat(-1, 1)), y: window.innerHeight/(3.5 + _Math.randFloat(-1, 1))}}>
        <Resizable
            onClick={e => props.setActive(number)}
            style={{position:"absolute",zIndex: active ? 4 : 3,display:"flex",flexDirection: "column"}}
            defaultSize={{
            width: window.innerWidth*40/100,
            height: window.innerHeight*50/100
            }}
            minWidth={200}
            minHeight={200}
            enable={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:true ,bottomLeft:false, topLeft:false }}
            handleClasses={{bottomRight:"resize"}}
            >
            <div onMouseDown={e => props.setActive(number)} className={active ? "bar active" : "bar inactive"}><div className="bar_title"><span className="background_highlight" style={{color:active ? "white" : "black"}}>{content.window_title}</span></div><div className="close background_highlight" onClick={e => props.closeWindow(number)}>X</div></div>
            <div onMouseDown={e => props.setActive(number)} className={active ? "content active" : "content inactive"}></div>
        </Resizable>  
    </Draggable>
    )
}
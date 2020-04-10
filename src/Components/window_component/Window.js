import React, { useState, useEffect } from "react"
import MailchimpSubscribe from "react-mailchimp-subscribe"
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import "./Window.scss"
import * as data from "./content.json"
import { Math as _Math } from "three"
import CustomForm from "./custom_form_component/CustomForm"

export default function Window({ number, type, isActive, isMobile, ...props }) {
    const content = data.default[type]
    let active = isActive === number ? true : false
    let [initialPositions, setPositions] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setPositions({ x: window.innerWidth / (2.9 + _Math.randFloat(-1, 1)), y: window.innerHeight / (3.5 + _Math.randFloat(-1, 1)) })
    }, []);

    return (
        <Draggable handle={".window_bar"} defaultPosition={isMobile ? { x: 0, y: 0 } : { x: initialPositions.x, y: initialPositions.y }} disabled={isMobile}>
            <Resizable
                enable={!isMobile}
                onClick={e => props.setActive(number)}
                className={"window"}
                style={{ position: "absolute", zIndex: active ? 4 : 3, left: isMobile ? 0 : initialPositions.x, top: isMobile ? 0 : initialPositions.y }}
                defaultSize={{
                    width: isMobile ? window.innerWidth - 10 : window.innerWidth * 40 / 100,
                    height: isMobile ? window.innerHeight - 10 : window.innerHeight * 50 / 100
                }}
                minWidth={200}
                minHeight={200}
                enable={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
                handleClasses={{ bottomRight: "window_resize" }}
            >
                <div onMouseDown={e => props.setActive(number)} className={active ? "window_bar window_active" : "window_bar window_inactive"}><div className="window_bar_title"><span style={{ color: active ? "white" : "black" }}>{content.window_title}</span></div><div className="window_bar_close" onClick={e => props.closeWindow(number)}>X</div></div>
                <div onMouseDown={e => props.setActive(number)} className={active ? "window_content window_active" : "content window_inactive"}>
                {type === "contact" ? 
                    <MailchimpSubscribe
                    url={content.url}
                    render={({ subscribe, status, message }) => (
                        <CustomForm
                            status={status}
                            message={message}
                            onValidated={formData => {subscribe(formData); console.log(formData)}}
                        />
                    )}
                    />
                : ""}
            </div>
        </Resizable>  
    </Draggable > 
    )
}


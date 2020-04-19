import React, { useState, useEffect, useRef} from "react"
import MailchimpSubscribe from "react-mailchimp-subscribe"
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import "./Window.scss"
import * as data from "./content.json"
import { Math as _Math } from "three"
import CustomForm from "./custom_form_component/CustomForm"
import ResizeObserver from 'react-resize-observer';
 

export default function Window({ number, type, isActive, isMobile, ...props }) {
    const contentWindow = useRef()
    const content = data.default[type]
    let active = isActive === number ? true : false
    let [initialPositions, setPositions] = useState({ x: 0, y: 0 })
    let [contentWidth, getContentWidth] = useState()
    let levelItems = []
    for(let i=0;i<26;i++){levelItems.push(i)}

    useEffect(() => {
        if(contentWindow.current){getContentWidth(contentWindow.current.offsetHeight)}
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
                    width: isMobile ? window.innerWidth - 10 : window.innerWidth * 60 / 100,
                    height: isMobile ? window.innerHeight - 10 : window.innerHeight * 65 / 100
                }}
                minWidth={200}
                minHeight={200}
                enable={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
                handleClasses={{ bottomRight: "window_resize" }}
            >
                <div onMouseDown={e => props.setActive(number)} className={active ? "window_bar window_active" : "window_bar window_inactive"} style={{cursor: "url(./portfolio/assets/window_cursors/cursor_normal.cur), auto"}}><div className="window_bar_title" style={{backgroundImage: "url(assets/bar_pattern.png)"}}><span style={{ color: active ? "white" : "black" }}>{content.window_title}</span></div><div className="window_bar_close" style={{cursor: "url(./portfolio/assets/window_cursors/cursor_pointer.cur), pointer"}} onClick={e => props.closeWindow(number)}>X</div></div>
                <div onMouseDown={e => props.setActive(number)} ref={contentWindow} className={active ? "window_content window_active" : "window_content window_inactive"} style={{cursor: "url(./portfolio/assets/window_cursors/cursor_normal.cur), auto"}}>
                <ResizeObserver onResize={(rect) => getContentWidth(rect.width)}/>
                {type === "contact" ? 
                    <MailchimpSubscribe
                    url={content.url}
                    render={({ subscribe, status, message }) => (
                        <CustomForm
                            status={status}
                            message={message}
                            onValidated={formData => {subscribe(formData)}}
                        />
                    )}
                    />
     
                : 

                type === "ABOUT ME" ? 

                <div className={contentWidth < 575 || isMobile ? "window_content_about mobile_item" : "window_content_about"}>
                    <div className="window_content_about_portrait" style={{backgroundImage:"url(/assets/photo.png)"}}>
                    </div>
                    <div className="window_content_about_content">
                        <div className="window_content_about_content_title">ABOUT MYSELF</div>
                        <div className="window_content_about_content_text" dangerouslySetInnerHTML={content.text}></div>
                    </div>
                </div>

                :

                <div>                  
                    <div className={contentWidth < 575 || isMobile ? "window_content_summary mobile_item" : "window_content_summary"}>
                        <div className={contentWidth < 575 || isMobile ? "window_content_summary_title mobile_title" : "window_content_summary_title"}>SUMMARY</div>
                        <div className={contentWidth < 575 || isMobile ? "window_content_summary_item mobile_content" : "window_content_summary_item"}  dangerouslySetInnerHTML={content.summary}></div>
                    </div> 
                    <div className={contentWidth < 575 || isMobile ? "window_content_knowledge mobile_item" : "window_content_knowledge"}>
                        <div className={contentWidth < 575 || isMobile ? "window_content_knowledge_title mobile_title" : "window_content_knowledge_title"}>KNOWLEDGE</div>
                        {content.skills.map(item =>
                        <div className={contentWidth < 575 || isMobile ? "window_content_knowledge_item mobile_item_skill" : "window_content_knowledge_item"}>
                            <div className="window_content_knowledge_item_skill">
                                {contentWidth < 575 || isMobile ? "" : <img src={item.img}></img>}
                                <p>{item.text}</p>
                            </div>
                            <div className="window_content_knowledge_item_level">
                                <div className="window_content_knowledge_item_level_label">Level: </div>
                                <div className="window_content_knowledge_item_level_bar">
                                    {levelItems.map((bar,index) => index < item.level ? 
                                    <div className="window_content_knowledge_item_level_bar_active"></div> 
                                    : 
                                    <div className="window_content_knowledge_item_level_bar_inactive"></div>)}
                                </div>
                            </div>
                        </div>                               
                        )}     
                    </div>  
                    <div className={contentWidth < 575 || isMobile ? "window_content_projects mobile_item" : "window_content_projects"}>
                        <div className={contentWidth < 575 || isMobile ? "window_content_projects_title mobile_title" : "window_content_projects_title"}>SOME PROJECTS</div>
                        {content.projects.map(item => 
                            <div className={contentWidth < 575 || isMobile ? "window_content_projects_item window_content_projects_item_column" : "window_content_projects_item window_content_projects_item_row"}>
                                <div className="window_content_projects_item_text" dangerouslySetInnerHTML={item.text}></div>
                                <div className="window_content_projects_item_img" style={{backgroundImage:"url(" + item.img + ")"}}></div>
                            </div>
                        )}
                    </div>
                    <div className={contentWidth < 575 || isMobile ? "window_content_contact mobile_contact" : "window_content_contact"}>
                            If you want to know more about my skills in <b>{content.window_title},</b> please contact me through my <span>linkedIn</span> or write me a nice <span onClick={e=>{props.newWindow("contact");e.stopPropagation()}} style={{cursor: "url(./portfolio/assets/window_cursors/cursor_pointer.cur), pointer"}}>email</span>
                    </div>  
                </div>
                }
                </div>
        </Resizable>  
    </Draggable > 
    )
}


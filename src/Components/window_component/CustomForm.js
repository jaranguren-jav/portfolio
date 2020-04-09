import React from "react";


export default function CustomForm({ status, message, onValidated }) {
    let email, message_text;
    const submit = () =>
        email &&
        message_text &&
        email.value.indexOf("@") > -1 &&
        onValidated({
            EMAIL: email.value,
            TEXT: message_text.value
        });

    return (
        <div className="customForm">
            <input 
                ref={node => (email = node)}
                type="email"
                placeholder="Your email"
            />
            <br />
            <textarea className="message"              
                ref={node => (message_text = node)}
                type="text"
                placeholder="Write me a nice letter, I like talking to humans from time to time!"
            />
            <br />
            <div className="bottomArea">
                <button onClick={submit}>SEND</button>
                {status === "sending" && <div className="sending">Your message is sending now...</div>}
                {status === "error" && <div className="error">{message}</div>}
                {status === "success" && <div className="success">{message}</div>}
            </div>
        </div>
    );
};
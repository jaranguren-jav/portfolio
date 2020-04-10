import React from "react";
import "./CustomForm.scss"


export default function CustomForm({ status, message, onValidated }) {
    let email, message_text;
    const submit = () =>
        email &&
        message_text &&
        email.value.indexOf("@") > -1 &&
        onValidated({
            EMAIL: email.value,
            MESSAGE: message_text.value
        });

    return (
        <div className="customForm">
            <input 
                ref={node => (email = node)}
                type="email"
                placeholder="Your email"
                value="jaranguren.jav@gmail.com"
            />
            <br />
            <textarea             
                ref={node => (message_text = node)}
                type="text"
                placeholder="Write me a nice letter, I like talking to humans from time to time!"
                value="Hola!"
            />
            <br />
            <div>
                <button onClick={submit}>SEND</button>
                {status === "sending" && <div className="sending">Your message is sending now...</div>}
                {status === "error" && <div className="error">{message}</div>}
                {status === "success" && <div className="success">{message}</div>}
            </div>
        </div>
    );
};

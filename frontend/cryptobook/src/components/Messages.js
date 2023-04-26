import React, {useEffect, useState} from 'react';

function Messages(props) {

    const [messages, setMessages] = useState(props.data);

    useEffect(() => {
        setMessages(props.data);
    }, [props.data]);

    return (
        <div>
            {messages.map((message, key) => (
                <div key={key}>
                    <h6>{message.receiver}</h6>
                    <h6>{message.message}</h6>
                    <h6>{message.date}</h6>
                </div>
            ))}
        </div>
    )

}

export default Messages;
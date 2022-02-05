import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync")
      .then(response => {
        setMessages(response.data);
      })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('a8a64b2d8bf882de2893', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newmessage) {
      alert(JSON.stringify(newmessage));
      setMessages([...messages, newmessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages]);

  return (
    <div className="App">
      <div className="app__body">
        {/* Siderbar */}
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;

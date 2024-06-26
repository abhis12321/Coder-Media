"use client";
import React, { useState } from "react";
import { useAuth } from "../../_components/AuthProvider";


export default function Page(props) {
  const USER = useAuth();
  const socket = USER.socket;
  const[sender , setSender] = useState("hello");
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    fetch(`/api/users/${props.params.newUserChat}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSender(data);
        }
      });
  }, [props.params.newUserChat, USER.sender, USER]);

  React.useEffect(() => {
    socket?.on("connect", handleConnection);
    socket?.on("receivePersonalMessage", handlePersonalMessage);
    socket?.on("disconnect", handleDisconnection);

    return () => {
      socket?.off("connect", handleConnection);
      socket?.off("receivePersonalMessage", handlePersonalMessage);
      socket?.off("disconnect", handleDisconnection);
    }
  }, [sender]);


  const handleConnection = () => {
    socket.emit("new-user", USER.user?.name);
  }

  const handlePersonalMessage = async(data) => {
    if (data.senderId == sender?._id && data.receiverId == USER?.user?._id) {
      const box = document.querySelector(".chatting-message-box");
      let message = chatModel(data.Name  , data.message, "left");
      box.appendChild(message);
    }
  }

  const handleDisconnection = () => {
    // console.log("socket.io Disconnected..." , sender);
  }

  const handleSendNewMessage = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      const box = document.querySelector('.chatting-message-box');
      let content = chatModel("you" , message, 'right');
      box.appendChild(content);
      socket?.emit('sendPersonalMessage', { Name:USER.user?.name, message, senderId:USER?.user?._id, receiverId:sender?._id });
      setMessage("");
      // console.log("Sending..");
    }
  };

  return (
    <div className="text-white rounded-md bg-gradient-to-r from-white to-white dark:from-slate-900 dark:via-cyan-950 dark:to-slate-900 dark:text-white w-[100%] max-w-[900px] mx-auto py-4 pb-12 overflow-hidden relative h-nav" >
      <div className="bg-slate-950/10 dark:bg-slate-900 shadow-[0_0_3px_red] rounded-md p-2 mx-4 md:mx-9">
        <h1 className="text-2xl font-semibold drop-shadow-[1px_1px_1px_red]">{sender?.name}</h1>
        <p onClick={handlePersonalMessage}>loading...</p>
      </div>

      <div className="chatting-message-box flex flex-col justify-evenly gap-3 p-3 overflow-auto flex-1 md:mx-6">

      </div>
      
      <form className='flex items-center justify-center px-4 md:px-9 w-[100%] absolute bottom-2 bg-ed-500 gap-2' onSubmit={handleSendNewMessage}>
        <input className='bg-blue-700/10 focus:bg-blue-800/40 outline-none flex-1 px-4 py-2 rounded-lg text-violet-900 dark:text-gray-50 placeholder:text-gray-500 dark:placeholder:text-gray-400 ring-1 focus:ring-2 ring-cyan-700' type='text' placeholder="Enter your message" value={message} onChange={e => setMessage(e.target.value)} required />
        <button className='hidden sm:block px-8 py-2 rounded-lg bg-sky-900 ring-2 ring-cyan-600 font-semibold opacity-80 hover:opacity-100 hover:text-yellow-500 active:bg-violet-950'>send</button>
      </form>
    </div>
  );
}


function chatModel(name , message, direction) {
  const node = document.createElement('p');
  node.innerHTML = `<span class="text-gray-500">${name} : </span>${message}`;
  node.classList.add(`text-${direction}`, `${direction === "center" ? "self-center" : direction === "right" ? "self-end" : "start"}`, "py-1", "px-4", "rounded-md", "max-w-[80%]", "w-fit", "dark:bg-slate-950" , "bg-gray-600");

  return (
    node
  )
};

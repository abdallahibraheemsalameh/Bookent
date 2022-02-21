import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import NavBar from './favorites/navBar';
import Footer from './home/footer';
import Message from './chat/message'
import Conversation from './chat/conversation'
import { io } from "socket.io-client";

import ChatCss from './chat/style.module.css';

function Chat() {
    const { user, connected, setconnected } = useContext(AuthContext)
    let userId = ''
    if (user) userId = user._id

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [owner, setowner] = useState({});
    const socket = useRef();
    const scrollRef = useRef();


    useEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
          ChatCss.themelight : ChatCss.themedark
      }, [])
    

    useEffect(() => {
        if (connected)
            window.location.reload()
    }, [])


    useEffect(() => {
        socket.current = io(`ws:${process.env.REACT_APP_CHAT_API}`, { transports: ['websocket'], upgrade: false });
        setconnected(true)
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: data.createdAt,
            });
        });
    }, []);


    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    useEffect(() => {
        socket.current.emit("addUser", userId);
        // socket.current.on("getUsers", (users) => {
        //   setOnlineUsers(
        //     user.followings.filter((f) => users.some((u) => u.userId === f))
        //   );
        // });
    }, [user]);


    //  get conv

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getConv/${userId}`);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [userId])


    // get msgs

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getMsg/${currentChat?._id}`);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat])


    // new msg

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage) {
            const message = {
                sender: userId,
                text: newMessage,
                conversationId: currentChat._id,
                createdAt: Date.now()
            };

            const receiverId = currentChat.members.find(
                (member) => member !== userId
            );

            socket.current.emit("sendMessage", {
                senderId: userId,
                receiverId,
                text: newMessage,
            });

            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/addMsg/`, { message });
                setMessages([...messages, res.data]);
                setNewMessage("");
            } catch (err) {
                console.log(err);
            }
        }
    };




    useEffect(() => {
        if (currentChat) {
            let ownerId = currentChat.members.filter(m => m != userId)
            const getUser = async () => {
                try {
                    const res = await axios(`${process.env.REACT_APP_API_URL}/getOwner/${ownerId}`);
                    setowner(res.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getUser();
        }
    }, [currentChat])



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    return (
        <>
            <NavBar />


            <div className={ChatCss.messenger}>
                <div className={ChatCss.chatMenu}>
                    <div className={ChatCss.chatMenuWrapper}>
                        <p className={ChatCss.messageBottom}>Chats</p>
                        <hr/>
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={ChatCss.chatBox}>
                    <div className={ChatCss.chatBoxWrapper}>

                        {owner?.username &&
                            <div className={ChatCss.chatHeader}>
                                <img
                                    src={
                                        owner?.profileImg ?
                                            `${owner.profileImg}`
                                            :
                                            '/assets/user.svg'
                                    }
                                    alt="user"
                                />
                                <span>{owner?.username}</span>

                            </div>
                        }
                        {currentChat ? (
                            <>
                                <div className={ChatCss.chatBoxTop}>
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === userId} owner={m.sender === userId ? user : owner} />
                                        </div>
                                    ))}
                                </div>
                                <div className={ChatCss.chatBoxBottom}>
                                    <textarea
                                        className={ChatCss.chatMessageInput}
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className={ChatCss.chatSubmitButton} onClick={handleSubmit}>
                                        <img src="/assets/send.svg" alt="send" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className={ChatCss.noConversationText}>
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
            </div>






            <Footer />
        </>
    );
}

export default Chat;
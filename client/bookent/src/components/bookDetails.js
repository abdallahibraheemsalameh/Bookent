import { useLocation, withRouter } from "react-router-dom"
import { useLayoutEffect, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import BookCss from './bookDetails/style.module.css';
import ChatCss from './chat/style.module.css';
import NavBar from './favorites/navBar';
import Footer from './home/footer';
import Details from './bookDetails/details';
import Message from './chat/message'
import { io } from "socket.io-client";


function BookDetails() {
    const location = useLocation()
    const { book } = location.state ? location.state : null

    const { user, setuser, connected, setconnected } = useContext(AuthContext)
    let userId = ''
    if (user) userId = user._id

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [owner, setowner] = useState({});
    const [newConv, setnewConv] = useState()
    const socket = useRef();
    const scrollRef = useRef();
    const [startChat, setstartChat] = useState(false)


    useLayoutEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
            BookCss.themelight : BookCss.themedark

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])


    // add book to favorite

    const addToFav = (e, book) => {
        if (e) {
            axios.put(`${process.env.REACT_APP_API_URL}/addToFav`, { book, user },
                {
                    headers: {
                        "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
                    }
                })
                .then(res => setuser(res.data))
                .catch(err => console.log(err))
        }
        else {
            axios.put(`${process.env.REACT_APP_API_URL}/removeToFav`, { book, user },
                {
                    headers: {
                        "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
                    }
                })
                .then(res => setuser(res.data))
                .catch(err => console.log(err))
        }
    }


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/getOwner/${book.ownerId}`, {
            headers: {
                "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
            }
        }).then(res => {
            setowner(res.data)
        })

    }, [])







    useEffect(() => {
        if (connected)
            window.location.reload()
    }, [])



    function startConv(params) {
        setstartChat(true)
        if (conversations?.length === 0 && !currentChat) {
            let senderId = userId
            let receiverId = book.ownerId
            axios.post(`${process.env.REACT_APP_API_URL}/newConv`, { senderId, receiverId })
                .then(setnewConv(true))
                .catch()
        }
    }



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
                const one = res.data.filter(conv => (conv.members[1] === book.ownerId))
                setConversations(one);
                setCurrentChat(one[0])
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [userId, newConv])


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

            <div className={BookCss.main}>

                <div className={BookCss.books}>
                    {<Details book={book} user={user} addToFav={addToFav} startConv={startConv} ownerBooks={owner.booksList} />}
                </div>
            </div>


            {userId != book.ownerId && startChat &&


                <div className={ChatCss.messengerSmall}>
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
            }
            <Footer />
        </>
    );
}

export default withRouter(BookDetails);
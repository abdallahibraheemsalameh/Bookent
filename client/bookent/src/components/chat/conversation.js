import axios from "axios";
import { useEffect, useState } from "react";
import BookCss from './style.module.css';

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ownerId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`${process.env.REACT_APP_API_URL}/getOwner/${ownerId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className={BookCss.conversation}>
      <img
        className={BookCss.conversationImg}
        src={
          user?.profileImg ?
            `${user.profileImg}`
            :
            '/assets/user.svg'
        }
        alt="user"
      />
      <span className={BookCss.conversationName}>{user?.username}</span>
    </div>
  );
}
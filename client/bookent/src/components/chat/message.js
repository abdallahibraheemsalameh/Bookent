import { format } from "timeago.js";
import BookCss from './style.module.css';

export default function Message({ message, own ,owner}) {
  return (
    <div className={own ? BookCss.messageOwn : BookCss.message}>
      <div className={BookCss.messageTop}>
        <img
          className={BookCss.messageImg}
          src={owner.profileImg &&`${owner.profileImg}` || '/assets/user.svg'}
          alt={owner.username}
        />
        <p className={BookCss.messageText}>{message.text}</p>
      </div>
      <div className={BookCss.messageBottom}>{format(message.createdAt)}</div>
    </div>
  );
}
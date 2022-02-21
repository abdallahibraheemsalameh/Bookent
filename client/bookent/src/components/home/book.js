import HomeCss from './style.module.css';
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import defaultCover from '../assets/read1.svg'

import { AuthContext } from '../../AuthContext'

function Book({ book, addToFav }) {
    const { user } = useContext(AuthContext)
    let favBefore = false

    if (user?.favList && user?.favList.length > 0) {
        for (let i = 0; i < user.favList.length; i++) {
            if (book._id === user.favList[i]._id)
                favBefore = true
        }
    } 

    return (
        <>
            <div className={HomeCss.book} style={{ backgroundImage: book.coverPhoto ? `url(${book.coverPhoto})` : `url(${defaultCover})` }}>
                <div className={HomeCss.bookdetails}>
                    <Link to={{ pathname: `/Book/${book._id}`, state: { book } }}>
                        <p className={HomeCss.bookname}>{book.bookName}</p>
                    </Link>
                    <div className={HomeCss.love}>
                        <input type='checkbox' checked={favBefore} onChange={(e) => { addToFav(e.target.checked, book) }} />
                        <img src="/assets/love.svg" alt='add to favourite'/>
                    </div>
                    <p className={HomeCss.bookgen}>Genere: {book.bookGenere}</p>
                    <p className={HomeCss.bookdesc}>{book.description}</p>
                </div>
            </div>
        </>
    );
}

export default Book;
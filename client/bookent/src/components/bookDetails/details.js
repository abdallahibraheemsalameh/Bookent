import BookCss from './style.module.css';
import defaultCover from '../assets/read1.svg'
import { lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
const Mapp = lazy(() => import('./Map2'))


function Details({ book, user, addToFav, startConv, ownerBooks }) {
    let favBefore = false
    const [reportModal, setreportModal] = useState(false)
    const [report, setreport] = useState('')

    if (user?.favList && user?.favList.length > 0) {
        for (let i = 0; i < user?.favList.length; i++) {
            if (book._id === user.favList[i]._id)
                favBefore = true
        }
    }
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [book])

    function copyNum() {
        navigator.clipboard.writeText(book.ownerPhone)
        alert('phone copied !')
    }


    function favSm(_id) {
        if (user?.favList && user?.favList.length > 0) {
            for (let i = 0; i < user?.favList.length; i++) {
                if (_id === user.favList[i]._id)
                    return true
            }
        }
    }


    function RiseReport(e) {
        e.preventDefault()
        let sender = user._id
        let target = book.ownerId
        let boook = book._id

        axios.post(`${process.env.REACT_APP_API_URL}/addReport`, { sender, text: report, target, boook })
            .then((res) => alert(res.data), setreportModal(false))
            .catch()
    }
    return (
        <>
            <main className={BookCss.book}>
                <div className={BookCss.upperdetails}>
                    <section className={BookCss.details}>
                        <p className={BookCss.bookname}>{book.bookName}</p>
                        <p className={BookCss.bookgen}>Genere : {book.bookGenere}</p>
                        <p className={BookCss.booktime}>Loan time : {book.time} days</p>
                        <div className={BookCss.love}>
                            <input type='checkbox' checked={favBefore} onChange={(e) => { addToFav(e.target.checked, book) }} />
                            <img src="/assets/love.svg" alt='add to favourites' />
                        </div>
                        <p className={BookCss.bookowner}>Author : {book.author}</p>
                        <p className={BookCss.bookowner}>Year : {book.Year}</p>
                        <p className={BookCss.bookowner}>ISBN : {book.isbn}</p>
                        <p className={BookCss.bookowner}>Country :  {book.country}</p>
                        <p className={BookCss.bookowner}>Owner : {book.owner}</p>
                        <div className={BookCss.contacts}>
                            <button className={BookCss.booknum} onClick={copyNum}>
                                <p> {book.ownerPhone}</p>
                                <div><img src='/assets/phone.svg' alt='number phone' /></div>
                            </button>
                            {user._id != book.ownerId &&
                                <button onClick={startConv} className={BookCss.chat}>
                                    <img src='/assets/message.svg' alt='message' alt='chat' />
                                </button>
                            }
                            {user._id != book.ownerId &&
                                <button onClick={() => setreportModal(!reportModal)} className={`${BookCss.chat} ${BookCss.report}`}>
                                    <img src='/assets/err.svg' alt='report' />
                                </button>
                            }
                        </div>
                    </section>
                    <section className={BookCss.bookcover}>
                        <img src={book.coverPhoto ? `${book.coverPhoto}` : `${defaultCover}`} alt={book.bookName} />
                    </section>
                </div>
                <div className={BookCss.lowerdetails}>
                    <p className={BookCss.bookdesc}>{book.description}</p>

                    <div className={BookCss.bookLocation}>
                        <Mapp
                            GeoLA={book.location[0].split(',')[0]}
                            GeoLO={book.location[0].split(',')[1]}

                        />
                    </div>

                    {ownerBooks?.length > 1 &&
                        <div className={BookCss.ownerBooks}>
                            <h4>Also by this user :</h4>
                            {ownerBooks &&
                                ownerBooks.map((bk) => (
                                    bk._id != book._id &&
                                    <div className={BookCss.book} style={{ backgroundImage: bk.coverPhoto ? `url(${bk.coverPhoto})` : `url(${defaultCover})` }}>
                                        <div className={BookCss.bookdetails}>
                                            <Link to={{ pathname: `/Book/${bk._id}`, state: { book: bk } }}>
                                                <p className={BookCss.bookname}>{bk.bookName}</p>
                                            </Link>
                                            <div className={BookCss.love}>
                                                <input type='checkbox' checked={favSm(bk._id)} onChange={(e) => { addToFav(e.target.checked, bk) }} />
                                                <img src="/assets/love.svg" alt='add to favourites' />
                                            </div>
                                            <p className={BookCss.bookgen}>Genere: {bk.bookGenere}</p>
                                            <p className={BookCss.bookdesc}>{bk.description}</p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    }
                </div>

                {reportModal &&
                    <div className={BookCss.modalOverley}>
                        <div className={BookCss.modal}>
                            <a className={BookCss.closeModal} onClick={()=>setreportModal(false)}>
                                <svg viewBox="0 0 20 20">
                                    <path fill="#000000" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                                </svg>
                            </a>
                            <form onSubmit={RiseReport}>
                                <textarea onChange={(e) => setreport(e.target.value)} placeholder='type the report ...'></textarea>
                                <input type='submit' />
                            </form>
                        </div>
                    </div>}
            </main>
        </>
    );
}

export default Details;
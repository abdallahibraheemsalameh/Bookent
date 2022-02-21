import RestCss from './favorites/style.module.css';
import React, { useRef, useState, useLayoutEffect, useContext, lazy } from 'react';
import { AuthContext } from '../AuthContext'
import axios from 'axios'
const NavBar = lazy(() => import('./favorites/navBar'))
const Footer = lazy(() => import('./home/footer'))
const Book = lazy(() => import('./favorites/books2'))
const Welcome = lazy(() => import('./favorites/welcome'))


function YourBooks() {
    const books = useRef()

    const { user, setuser } = useContext(AuthContext)
    const [err, seterr] = useState()

    useLayoutEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
            RestCss.themelight : RestCss.themedark

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    function scrollTohalf() {
        books.current.scrollIntoView({ behavior: "smooth", block: 'start' });
    }


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

    const deleteBook = (book) => {
        if (window.confirm("Are you sure to delete this book!")) {
            axios.put(`${process.env.REACT_APP_API_URL}/deleteBook`, { book, user },
                {
                    headers: {
                        "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
                    }
                })
                .then(res => setuser(res.data))
                .catch(err => seterr(err.response.data))
        }
    }

    return (
        <>
            <NavBar />

            <div className={RestCss.main}>
                <Welcome scrollTohalf={scrollTohalf} />

                <div className={RestCss.books} ref={books}>
                    <div>
                        <h3>Your Books</h3>
                    </div>


                    <div className={RestCss.bookslist}>
                        {
                            user?.booksList && user?.booksList?.length > 0 ?
                                user.booksList.map((book) =>
                                    (<Book book={book} addToFav={addToFav} deleteBook={deleteBook} key={book._id} />)
                                )
                                :
                                (<center style={{ margin: '0 auto' }}>No Books Found !</center>)
                        }
                    </div>

                </div>
            </div>

            <img id={RestCss.imgsticky} src="/assets/Polygon 4.svg" alt='shape' />
            <Footer />
            {err && alert(err)}
        </>
    );
}

export default YourBooks;

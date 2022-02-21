import React, { useContext, useRef, useState, useEffect, useLayoutEffect, lazy } from 'react'
import { AuthContext } from '../AuthContext'
import { Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary'
import axios from 'axios'
import HomeCss from './home/style.module.css';
const NavBar = lazy(() => import('./home/navBar'))
const Footer = lazy(() => import('./home/footer'))
const Book = lazy(() => import('./home/book'))
const Welcome = lazy(() => import('./home/welcome'))


const Home = React.memo(props => {
    const [currentCountry, setcurrentCountry] = useState()
    const [currentGenere, setcurrentGenere] = useState()
    const [Search, setSearch] = useState()
    const [preSearch, setpreSearch] = useState()
    const [isLoading, setisLoading] = useState(true)

    const books = useRef()
    const [hideLast, sethideLast] = useState(false)

    const { isLogged, logout, user, setuser, countriesList, categoryList } = useContext(AuthContext)

    // for scroll fetch
    const [totalPages, settotalPages] = useState(0)
    const [pageNum, setpageNum] = useState(1)
    const [booksList, setbooksList] = useState([])
    const [lastElement, setlastElement] = useState(null);


    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
    };
    const observer = useRef(
        new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                setpageNum((no) => parseInt(no+1));
            }
        },
            options
        )
    );
    useEffect(() => {
        const currentElement = lastElement;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [lastElement])



    // onload page get books
    useEffect(() => {
        if (!isLogged)
            logout()
        else {
            setisLoading(true)
            axios.get(`${process.env.REACT_APP_API_URL}/getBooks?page=${pageNum}`, {
                headers: {
                    "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
                }
            }).then(res => {
                setisLoading(false)
                settotalPages(res.data.totalPages)
                setbooksList([...booksList, ...res.data.books])
            })
                .catch(err => console.log(err))
        }
    }, [pageNum])


    useEffect(() => {
        if (!currentCountry && !currentGenere && !Search) {
            setbooksList([])
            if (pageNum === 0)
                setpageNum('')
            else
                setpageNum(0)
            sethideLast(false)
        }
    }, [currentCountry, currentGenere, Search])


    // get books by name or other 
    const getSpecificBooks = useEffect(() => {
        if (currentCountry || currentGenere || Search) {
            setisLoading(true)
            axios.post(`${process.env.REACT_APP_API_URL}/getSpecificBooks`, {bookName: Search || null, bookGenere: currentGenere || null, country: currentCountry || null},
                {
                    headers: {
                        "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
                    }
                })
                .then(res => {
                    setisLoading(false)
                    setbooksList(res.data)
                })
                .catch(err => console.log(err))
        }
    }, [currentCountry, currentGenere, Search])



    useLayoutEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
            HomeCss.themelight : HomeCss.themedark

            setpageNum(1)
    }, [])

    function scrollTohalf() {
        books.current.scrollIntoView({ behavior: "smooth", block: 'start' });
    }




    function setGenere(genere) {
        setcurrentGenere(genere)
        sethideLast(true)
    }
    function setCountry(country) { setcurrentCountry(country) }




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

    return (
        <>
            <NavBar categoryList={categoryList} countriesList={countriesList} setCountry={setCountry} setGenere={setGenere} />

            <div className={HomeCss.main}>
                <Welcome categoryList={categoryList} scrollTohalf={scrollTohalf} setGenere={setGenere} />

                <div className={HomeCss.books} ref={books}>
                    <div>
                        <h3>Books</h3>
                    </div>


                    <div className={HomeCss.search}>
                        <form onSubmit={(e) => { e.preventDefault(); sethideLast(true); setSearch(preSearch); }}>
                            <input type="text" onChange={e => {
                                setpreSearch(e.target.value)
                                if (e.target.value === '')
                                    setSearch('')

                            }} placeholder="search for a book.." />
                            <input type="submit" value=' ' />
                        </form>
                    </div>

                    <section className={HomeCss.filters}>
                        {currentGenere &&
                            <div>
                                {currentGenere}
                                <button onClick={() => (setcurrentGenere(''))}>
                                    <img src='/assets/delete.svg' alt='del' loading='lazy' />
                                </button>
                            </div>
                        }

                        {currentCountry &&
                            <div>
                                {currentCountry}
                                <button onClick={() => (setcurrentCountry(''))}>
                                    <img src='/assets/delete.svg' alt='del' loading='lazy' />
                                </button>
                            </div>
                        }
                    </section>



                    <div className={HomeCss.bookslist}>
                        <ErrorBoundary fallback={<h1>Error Detected . Try again.</h1>}>
                            {
                                booksList.length > 0 ?
                                    booksList.map((book, i) => {
                                        return i === booksList.length - 1 && !isLoading &&
                                            pageNum <= totalPages && !hideLast ?
                                            (<div ref={setlastElement} id='lastBook' key={i}>
                                                <Book book={book} addToFav={addToFav} />
                                            </div>
                                            )
                                            :
                                            (<Book book={book} addToFav={addToFav} key={i} />)
                                    })
                                    :
                                    <center style={{position:'absolute', left:'0', right:'0'}}>No Books Found !</center>
                            }
                        </ErrorBoundary>
                        <div id={HomeCss.loader}>
                            {isLoading &&
                                <div className={HomeCss.clones2}></div>
                            }
                        </div>
                    </div>


                    <div className={HomeCss.countries}>
                        <select onChange={e => {
                            setCountry(e.target.value)
                            sethideLast(true)
                        }}>
                            <option value=''>Country :</option>
                            {countriesList.map((country, i) => (<option key={i}>{country}</option>))}
                        </select>
                    </div>

                    <div className={HomeCss.addsticky}>
                        <Link to='addBook'>
                            <p>Add Book</p>
                            <img src="/assets/add.svg" alt='add book'/>
                        </Link>
                    </div>

                </div>
            </div>


            <img id={HomeCss.imgsticky} src="/assets/Polygon 4.svg" alt='shape'/>
            <Footer logout={logout} />
        </>
    );
})
export default Home

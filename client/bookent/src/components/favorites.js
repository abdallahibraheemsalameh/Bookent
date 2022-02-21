import RestCss from './favorites/style.module.css';
import React, { useRef, useLayoutEffect, useContext, lazy } from 'react';
import { AuthContext } from '../AuthContext'
import axios from 'axios'
const NavBar = lazy(() => import('./favorites/navBar'))
const Footer = lazy(() => import('./home/footer'))
const Book = lazy(() => import('./favorites/book'))
const Welcome = lazy(() => import('./favorites/welcome'))


function Favorites() {
  const books = useRef()

  const { user, setuser } = useContext(AuthContext)

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
    axios.put(`${process.env.REACT_APP_API_URL}/removeToFav`, { book, user },
      {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
        }
      })
      .then(res => setuser(res.data))
      .catch(err => console.log(err))
  }


  return (
    <>
      <NavBar />

      <div className={RestCss.main}>
        <Welcome scrollTohalf={scrollTohalf} />

        <div className={RestCss.books} ref={books}>
          <div>
            <h3>Favourite</h3>
          </div>



          <div className={RestCss.bookslist}>
            {
              user?.favList && user?.favList?.length > 0 ?
                user.favList.map((book) =>
                  (<Book book={book} addToFav={addToFav} key={book._id} />)
                )
                :
                (<center style={{ margin: '0 auto' }}>No Books Found !</center>)
            }
          </div>



        </div>
      </div>


      <img id={RestCss.imgsticky} src="/assets/Polygon 4.svg" alt='shape'/>
      <Footer />
    </>
  );
}

export default Favorites;

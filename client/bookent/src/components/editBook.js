import { useState, useLayoutEffect, useEffect, useContext, lazy } from 'react';
import { useLocation , useHistory} from "react-router-dom"
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import classes from './addBook/addBook.module.css';
const Mapp = lazy(() => import('./addBook/Map'))
const NavBar = lazy(() => import('./favorites/navBar'))
const Footer = lazy(() => import('./home/footer'))


function EditBook() {
  const history = useHistory()
  const location = useLocation()
  const { book } = location.state ? location.state : null
  const { user, setuser, categoryList } = useContext(AuthContext)
  const [editInfo, seteditInfo] = useState({
  })

  const [Geolatitude, setGeolatitude] = useState(0);
  const [Geolongitude, setGeolongitude] = useState(0);
  const [closeModal, setCloseModal] = useState(true);
  const [err, seterr] = useState()

  useEffect(() => {
    seteditInfo({
      ...editInfo,
      _id: book._id,
      bookName: book.bookName,
      description: book.description,
      bookGenere: book.bookGenere,
      coverPhoto: '',
      time: book.time,
      location: book.location,
      ownerId:user._id,
      booksList: JSON.stringify(user.booksList) || [],
      year:book.year,
      isbn:book.isbn,
      author:book.author,
      prevImg:book.coverPhoto
    })
  }, [user])

  function addChange(e) {
    seteditInfo({ ...editInfo, [e.target.name]: e.target.value })
  }

  const add = (e) => {
    e.preventDefault()
    const formData = new FormData();
    for (const i in editInfo)
      formData.append(i, editInfo[i])
    axios.put(`${process.env.REACT_APP_API_URL}/editBook`, formData,
    {
      headers: {
          "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
      }
  })
      .then((res) => {
        setuser({ ...user, booksList: res.data })
        history.goBack()
      })
      .catch(err => seterr(err.response.data))
  }





  useLayoutEffect(() => {
    let theme = localStorage.getItem('theme')
    document.documentElement.className = theme.toString() === 'themelight' ?
      classes.themelight : classes.themedark
  }, [])



  function GeolocationHandler() {
    if (navigator.geolocation) {
      // console.log(navigator.geolocation.getCurrentPosition((position) => {position.coords});
      navigator.geolocation.getCurrentPosition((position) => {
        setGeolatitude(position.coords.latitude);
        setGeolongitude(position.coords.longitude);
        seteditInfo({ ...editInfo, location: [position.coords.latitude, position.coords.longitude] })
        setCloseModal(false);
      });
    } else alert("Geolocation is not supported in your browser");
  }

  function clickDropHandler() {
    setCloseModal(true);
  }

  return (
    <>
      <NavBar />

      <div className={classes.main}>

{!closeModal === true ? (
  <Mapp
    GeoLA={Geolatitude}
    GeoLO={Geolongitude}
    onClose={clickDropHandler}
  />
) : (
  ''
)}

<form className={classes.container} onSubmit={add}>
  <h2 className={classes.h2}>Edit Book</h2>
  <div className={classes.bookName__div}>
    <span className={classes.spans}>Book Name:</span>
    <input
      type='text'
      name='bookName'
      onChange={addChange}
      className={`${classes.bookName__input} ${classes.inputs}`}
      required
      autoFocus
      defaultValue={book.bookName}
    ></input>
  </div>

  <div className={classes.description__div}>
    <span className={classes.spans}>Description:</span>
    <textarea
      name='description'
      onChange={addChange}
      className={`${classes.description__input} ${classes.inputs}`}
      defaultValue={book.description}
    ></textarea>
  </div>

  <div className={classes.days__div}>
    <span className={classes.spans}>
      Loan time:{' '}
      <input
        type='number'
        min='0'
        name='time'
        defaultValue='0'
        onChange={addChange}
        className={`${classes.days__input} ${classes.inputs}`}
        required
        defaultValue={book.time}
      ></input>{' '}
      Days{' '}
    </span>
  </div>

  <div className={classes.type__div}>
    <label>
      <span className={classes.spans}>Book type:</span>

      <select className={`${classes.type__input} ${classes.inputs}`}
        name='bookGenere'
        onChange={addChange}
        defaultValue={book.bookGenere}
      >
        {categoryList.map((book, i) => (
          <option key={i} >
            {book}
          </option>
        ))}
      </select>
    </label>
  </div>

  <div className={classes.bookName__div}>
    <span className={classes.spans}>Book Author:</span>
    <input
      type='text'
      name='author'
      onChange={addChange}
      className={`${classes.bookName__input} ${classes.inputs}`}
      defaultValue={book.author}
    ></input>
  </div>

  <div className={classes.bookName__div}>
    <span className={classes.spans}>ISBN / Barcode:</span>
    <input
      type="text" pattern="\d*" maxlength="13"
      name='isbn'
      onChange={addChange}
      className={`${classes.bookName__input} ${classes.inputs}`}
      defaultValue={book.isbn}
    ></input>
  </div>

  <div className={classes.bookName__div}>
    <span className={classes.spans}>Year:</span>
    <input
      type="text" pattern="\d*" maxlength="4"
      name='year'
      onChange={addChange}
      className={`${classes.bookName__input} ${classes.inputs}`}
      defaultValue={book.year}
    ></input>
  </div>


  <div className={classes.photo__div}>
    <div>
      Book Photo :
      <label className={classes.customfileupload}>
        Choose Photo
        <input type='file' name='coverPhoto'
          accept='.png, .jpg, .jpeg'
          onChange={(e) => {
            seteditInfo({ ...editInfo, coverPhoto: e.target.files[0] })
          }}
        />
      </label>
      {editInfo.coverPhoto && <span style={{marginLeft:'5vw'}}>saved!</span>}
    </div>
  </div>

  <div className={classes.location__div}>
    <div>
      <span className={classes.spans}>Your Location:</span>
      <figure className={classes.mapy}>
        <img
          onClick={GeolocationHandler}
          src='/assets/map.png'
          alt='map'
          height='30'
        ></img>
      </figure>
      {editInfo.location?.length > 0 && <span style={{marginLeft:'5vw'}}>saved!</span>}
    </div>
  </div>

  {err && <div className={classes.err}><h5>{err && <img src='/assets/err.svg' alt='error' />}{err}</h5></div>}


  <div className={classes.submit__div}>
    <input
      type='submit'
      value='Update Book'
      className={`${classes.submit} ${classes.inputs}`}
    ></input>
    <input
      type='reset'
      value='cancel'
      className={`${classes.cancel} ${classes.inputs}`}
    ></input>
  </div>
</form>
</div>
<div style={{ margin: 500 }}></div>
      <Footer />
    </>
  );
}

export default EditBook;

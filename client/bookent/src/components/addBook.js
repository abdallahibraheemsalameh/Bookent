import { useState, useLayoutEffect, useEffect, useContext, lazy } from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import classes from './addBook/addBook.module.css';
const Mapp = lazy(() => import('./addBook/Map'))
const NavBar = lazy(() => import('./favorites/navBar'))
const Footer = lazy(() => import('./home/footer'))

function AddBook() {
  const history = useHistory()
  const { user, setuser, categoryList } = useContext(AuthContext)
  const [addInfo, setaddInfo] = useState({
  })

  const [Geolatitude, setGeolatitude] = useState(0);
  const [Geolongitude, setGeolongitude] = useState(0);
  const [closeModal, setCloseModal] = useState(true);
  const [err, seterr] = useState()

  useEffect(() => {
    setaddInfo({
      ...addInfo,
      bookName: '',
      description: '',
      bookGenere: 'islamic',
      coverPhoto: '',
      time: 0,
      location: [],
      country: user.country,
      owner: user.username,
      ownerId: user._id,
      ownerPhone: user.phone,
      booksList: JSON.stringify(user.booksList),
      author: '',
      year: '',
      isbn: ''
    })
  }, [user])

  function addChange(e) {
    setaddInfo({ ...addInfo, [e.target.name]: e.target.value })
  }

  const add = (e) => {
    e.preventDefault()
    const formData = new FormData();
    for (const i in addInfo)
      formData.append(i, addInfo[i])
    axios.put(`${process.env.REACT_APP_API_URL}/addNewBook`, formData,
      {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
        }
      })
      .then((res) => {
        let list = user.booksList
        list.push(res.data)
        setuser({ ...user, booksList: list })
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
        setaddInfo({ ...addInfo, location: [position.coords.latitude, position.coords.longitude] })
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
          <h2 className={classes.h2}>Add Book</h2>
          <div className={classes.bookName__div}>
            <span className={classes.spans}>Book Name:</span>
            <input
              type='text'
              name='bookName'
              onChange={addChange}
              className={`${classes.bookName__input} ${classes.inputs}`}
              required
              autoFocus
            ></input>
          </div>

          <div className={classes.description__div}>
            <span className={classes.spans}>Description:</span>
            <textarea
              name='description'
              onChange={addChange}
              className={`${classes.description__input} ${classes.inputs}`}
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
            ></input>
          </div>

          <div className={classes.bookName__div}>
            <span className={classes.spans}>ISBN / Barcode:</span>
            <input
              type="text" pattern="\d*" maxlength="13"
              name='isbn'
              onChange={addChange}
              className={`${classes.bookName__input} ${classes.inputs}`}
            ></input>
          </div>

          <div className={classes.bookName__div}>
            <span className={classes.spans}>Year:</span>
            <input
              type="text" pattern="\d*" maxlength="4"
              name='year'
              onChange={addChange}
              className={`${classes.bookName__input} ${classes.inputs}`}
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
                    setaddInfo({ ...addInfo, coverPhoto: e.target.files[0] })
                  }}
                />
              </label>
              {addInfo.coverPhoto && <span style={{marginLeft:'5vw'}}>saved!</span>}
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
              {addInfo.location?.length > 0 && <span style={{marginLeft:'5vw'}}>saved!</span>}
            </div>
          </div>

          {err && <div className={classes.err}><h5>{err && <img src='/assets/err.svg' alt='error' />}{err}</h5></div>}


          <div className={classes.submit__div}>
            <input
              type='submit'
              value='add Book'
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

export default AddBook;

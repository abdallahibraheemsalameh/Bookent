import React, { useState, useLayoutEffect, useEffect, useContext, lazy } from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import axios from 'axios'
import classes from './editProfile/editForm.module.css';
const NavBar = lazy(() => import('./favorites/navBar'))
const Footer = lazy(() => import('./home/footer'))


function EditProfile() {
  const history = useHistory()
  const { user, setuser, countriesList } = useContext(AuthContext)

  const [chosedImg, setchosedImg] = useState('')
  const [editUser, seteditUser] = useState({})
  const [err, seterr] = useState()
  useEffect(() => {
    seteditUser({
      ...editUser,
      _id: user._id,
      username: user.username,
      pass: '',
      phone: user.phone,
      country: user.country,
      profileImg: user.profileImg,
      prevImg: user.profileImg,
      prevUsername: user.username,
      booksList: JSON.stringify(user.booksList)
    })
  }, [user])


  const editChange = (e) => {
    seteditUser({ ...editUser, [e.target.name]: e.target.value })
  }

  const edit = (e) => {
    e.preventDefault()
    const formData = new FormData();
    for (const i in editUser)
      formData.append(i, editUser[i])
    axios.put(`${process.env.REACT_APP_API_URL}/updateUser`, formData,
      {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem('token'))?.token
        }
      })
      .then((res) => {
        setuser({
          ...user,
          username: editUser.username,
          phone: editUser.phone,
          country: editUser.country,
          profileImg: res.data.profileImg,
          booksList: res.data.bookslist
        })
        history.goBack()
      })
      .catch(err => seterr(err.response.data))
  }


  useLayoutEffect(() => {
    let theme = localStorage.getItem('theme')
    document.documentElement.className = theme.toString() === 'themelight' ?
      classes.themelight : classes.themedark
  }, [])


  return (
    <>
      <NavBar />

      <div className={classes.main}>
        <div className={classes.container}>
          <h2 className={classes.h2}>Edit Your Profile</h2>

          <form className={classes.editForm} onSubmit={edit}>
            <div className={classes.choosePicture__div}>
              <div className={classes.photoContainer}>
                <img src={chosedImg || user.profileImg && `${user.profileImg}` || '/assets/user.svg'} alt='profile image'></img>
              </div>
              <div className={classes.chooseFileContainer}>
                <label className={classes.customfileupload}>
                  <input type='file' name="profileImg"
                    accept='.png, .jpg, .jpeg'
                    onChange={(e) => {
                      seteditUser({ ...editUser, profileImg: e.target.files[0] })
                      setchosedImg(URL.createObjectURL(e.target.files[0]))
                    }} />
                  Choose Photo
                </label>
              </div>
              {err &&<div className={classes.err}><h5>{err && <img src='/assets/err.svg' alt='error' />}{err}</h5></div>}
            </div>

            <div className={classes.fromInputs__div}>
              <div className={classes.input__div}>
                <span>Username:</span>
                <input
                  type='text'
                  name='username'
                  onChange={editChange}
                  defaultValue={user.username}
                  required
                  className={`${classes.input__username} ${classes.formInputs}`}
                ></input>
              </div>

              <div className={classes.input__div}>
                <span>New Password:</span>
                <input
                  type='password'
                  name='pass'
                  onChange={editChange}
                  minLength='8'
                  className={`${classes.input__password} ${classes.formInputs}`}
                ></input>
              </div>

              <div className={classes.input__div}>
                <span>Phone:</span>
                <input
                type="text" pattern="\d*" maxlength="10"
                name='phone'
                  onChange={editChange}
                  defaultValue={user.phone}
                  required
                  className={`${classes.input__phone} ${classes.formInputs}`}
                ></input>
              </div>

              <div className={classes.input__div}>
                <span>Country:</span>
                <select
                  name='country'
                  onChange={editChange}
                  defaultValue={user.country}
                  className={`${classes.formInputs__SignUp} ${classes.country}`}
                >
                  {countriesList.map((country, i) => (
                    <option value={country} key={i}>{country}</option>
                  ))}
                </select>
              </div>

              <div className={classes.submitButtons__div}>
                <input
                  className={classes.submit__btn}
                  type='submit'
                  value='update Profile'
                ></input>
                <input
                  className={classes.cancle__btn}
                  type='reset'
                  value='Cancel'
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div style={{margin:350}}></div>
      <Footer />
    </>
  );
}
export default EditProfile;

import React, { useState, useContext, useEffect, lazy } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../AuthContext'
import axios from 'axios'

import classes from './login/All.module.css';
import Logo from './assets/logoBlack.svg';
import Wave from './assets/wave.svg';
const LoginForm = lazy(() => import('./login/loginForm'))
const SignUpForm = lazy(() => import('./login/signUpForm'))
const Introduction = lazy(() => import('./login/introduction'))

export default function Login() {

    const [logErr, setlogErr] = useState()
    const [signErr, setsignErr] = useState()


    const [logUser, setlogUser] = useState({
        username: '',
        pass: '',
    })

    const [signUser, setsignUser] = useState({
        username: '',
        pass: '',
        phone: '',
        country: 'Jordan',
        profileImg: ''
    })


    let history = useHistory()

    const { login, logout } = useContext(AuthContext)

    useEffect(() => {
        localStorage.setItem('theme', 'themelight')
        logout()
    }, [])

    const logChange = (e) => {
        setlogUser({ ...logUser, [e.target.name]: e.target.value })
    }

    const signChange = (e) => {
        setsignUser({ ...signUser, [e.target.name]: e.target.value })
    }


    function logIn(e) {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_URL}/getUser`, { logUser })
            .then(res => {
                if (res?.data?.token && res?.data?.user) {
                    login(res.data.token, res.data.user)
                    history.push('/home')
                }
            })
            .catch(err => setlogErr(err.response.data))
    }

    function signUp(e) {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_URL}/newUser`, { signUser })
            .then(res => setSignClicked(!setSignClicked))
            .catch(err => setsignErr(err.response.data))
    }



    const [signClicked, setSignClicked] = useState(false);
    const [showClicked, setShowClicked] = useState(true);

    function showClickedHandler(val) {
        !val ? setShowClicked(false) : setShowClicked(true);
    }

    function signClickedHandler(val) {
        val ? setSignClicked(true) : setSignClicked(false);
    }
    function LogClickedHandler(val) {
        val ? setSignClicked(false) : setSignClicked(true);
    }

    return (
        <>
            <div className={classes.LogoHolder}>
                <img src={Logo} loading='lazy' alt='logo' className={classes.logo}></img>
            </div>

            <div className={!showClicked ? `${classes.hide}` : ''}>
                <Introduction onShowClicked={showClickedHandler} />
            </div>

            <div className={signClicked || showClicked ? `${classes.hide}` : ''}>
                <LoginForm onSignClicked={signClickedHandler} logChange={logChange} logIn={logIn} logErr={logErr} />
            </div>

            <div className={!signClicked ? `${classes.hide}` : ''}>
                <SignUpForm onSignClicked={LogClickedHandler} signChange={signChange} signUp={signUp} signErr={signErr} />
            </div>

            <img src={Wave} loading='lazy' alt='wave' className={classes.wave}></img>
        </>
    );
}


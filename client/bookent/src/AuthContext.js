import React, { createContext, useState, useLayoutEffect, useCallback } from 'react'

export const AuthContext = createContext()

export const AuthProvider = (props) => {

    const [countriesList, setcountriesList] = useState(['Jordan', 'Palestine', 'Iraq', 'Ksa', 'egypt', 'Lebanon'])
    const [categoryList, setcategoryList] = useState(['islamic', 'story', 'food', 'culuture', 'science', 'education', 'other'])
    const [auth, setauth] = useState(localStorage.getItem('token') || null)
    const [user, setuser] = useState(localStorage.getItem('user') || null)
    const [expirationTime, setexpirationTime] = useState()
    let logoutTimer;
    const [connected, setconnected] = useState(false)



    const login = useCallback((token, user ,expirationTime) => {
        setauth({token})
        setuser(user)

        const expiration = expirationTime || new Date(new Date().getTime() + 60 * 60 * 24 * 1000);

        setexpirationTime(expiration);     //set expiration time one hour from current time

        localStorage.setItem(
            "token",
            JSON.stringify({
                token:token,
                expirationTime: expiration.toString()
            })
        );
        localStorage.setItem("user",JSON.stringify(user))

    }, []);


    const logout = useCallback(() => {
        setauth(null);
        setexpirationTime(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);



    //hook to check if something is there in localStorage and logs user in accordingly
    useLayoutEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('token'));
        const userData = JSON.parse(localStorage.getItem('user'));
        if (storedData && userData &&storedData.token && new Date(storedData.expirationTime) > new Date()) {
            login(storedData.token , userData , new Date(storedData.expirationTime));
        }
    }, [login]);



    //new useEffect hook to set the timer if the expiration time is in future otherwise we clear the timer here
    useLayoutEffect(() => {
        if (auth && expirationTime) {
            const remainingTime = expirationTime.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [auth, logout, expirationTime]);



    useLayoutEffect(() => {
        localStorage.setItem("user",JSON.stringify(user))
    },[user])
    return (
        <AuthContext.Provider value={{ isLogged: !!auth ,login, logout,user,setuser , countriesList , categoryList , connected, setconnected}}>
            {props.children}
        </AuthContext.Provider>
    )
}

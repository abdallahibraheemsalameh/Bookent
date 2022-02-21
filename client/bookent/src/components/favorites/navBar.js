import React, { useRef, useContext,useLayoutEffect} from 'react';
import RestCss from './style.module.css';
import { AuthContext } from '../../AuthContext'
import { Link } from 'react-router-dom'


function NavBar(props) {
    const refMenu = useRef()
    const { logout, user } = useContext(AuthContext)

    function showMenu(e) {
        if (e.target.checked) {
            refMenu.current.style = 'display:flex'
        }
        else {
            refMenu.current.style = 'display:none'
        }
    }

    useLayoutEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
            RestCss.themelight : RestCss.themedark
    }, []) 

    function darkToggle(e) {
        if (e.target.checked) {
            document.documentElement.className = RestCss.themedark
            localStorage.setItem('theme', 'themedark')
        } else {
            document.documentElement.className = RestCss.themelight
            localStorage.setItem('theme', 'themelight')
        }
    }

    return (
        <>
            <div className={RestCss.navbar}>
            <div className={RestCss.logoDiv}>
                    <Link to='/home'>
                        <img src="/assets/bookent logo black.svg" className={RestCss.big} loading='lazy' alt='bookent logo'/>
                        <img src="/assets/logo small.svg" className={RestCss.small} loading='lazy' alt='bookent logo'/>
                    </Link>
                </div>

                <div className={RestCss.addDiv}>
                    <Link to='/addBook'>
                        <img src="/assets/add.svg" alt='add book'/>
                    </Link>
                </div>

                <div className={RestCss.infosDiv}>
                    <div className={RestCss.menu} ref={refMenu}>

                        <div className={RestCss.categs}>

                            <div className={RestCss.navi}>
                                <Link to='/home'>
                                    <div>
                                        <p>Home</p>
                                    </div>
                                </Link>
                            </div>

                            <div className={RestCss.navi}>
                            <Link to='/chat'>
                                <div>
                                    <p>Messages</p>
                                </div>
                            </Link>
                            </div>

                            <div className={RestCss.navi}>
                                <div onClick={logout}>
                                    <p>Log out</p>
                                </div>
                            </div>

                        </div>

                        <div className={RestCss.dark}>
                            <div className={RestCss.toggleButtonCover}>
                                <div className={RestCss.buttonCover}>
                                    <div className={`${RestCss.button}  ${RestCss.r}`} id={RestCss.button3}>
                                        <input type="checkbox" className={RestCss.checkbox} onChange={darkToggle} defaultChecked={localStorage.getItem('theme') === 'themedark' ? true : false} />
                                        <div className={RestCss.knobs}></div>
                                        <div className={RestCss.layer}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to='/profile'>
                            <div className={RestCss.profile}>
                                <img src={user && user.profileImg && `${user.profileImg}` || '/assets/user.svg'} alt='profile' />
                                <span>{user && user.username}</span>
                            </div>
                        </Link>
                    </div>

                    <div className={RestCss.hamDiv}>
                        <input type='checkbox' id={RestCss.hamcheck} onChange={showMenu} />
                        <div id={RestCss.ham}></div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default NavBar;
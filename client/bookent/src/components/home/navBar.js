import React, { useRef, useContext,useLayoutEffect } from 'react';
import HomeCss from './style.module.css';
import { AuthContext } from '../../AuthContext'
import { Link } from 'react-router-dom'


function NavBar(props) {
    const refMenu = useRef()
    const countryModal = useRef()
    const { logout, user } = useContext(AuthContext)

    function showMenu(e) {
        if (e.target.checked) {
            refMenu.current.style = 'display:flex'
        }
        else {
            refMenu.current.style = 'display:none'
            countryModal.current.style = 'display:none'
        }
    }

    useLayoutEffect(() => {
        let theme = localStorage.getItem('theme')
        document.documentElement.className = theme.toString() === 'themelight' ?
            HomeCss.themelight : HomeCss.themedark
    }, [])

    function darkToggle(e) {
        if (e.target.checked) {
            document.documentElement.className = HomeCss.themedark
            localStorage.setItem('theme', 'themedark')
        } else {
            document.documentElement.className = HomeCss.themelight
            localStorage.setItem('theme', 'themelight')
        }
    }


    function toggleCountry(e) {
        countryModal.current.style = 'display:block'

    }
    return (
        <>
            <div className={HomeCss.navbar}>
                <div className={HomeCss.logoDiv}>
                    <Link to='/home'>
                        <img src="/assets/bookent logo black.svg" className={HomeCss.big} loading='lazy' alt='bookent logo'/>
                        <img src="/assets/logo small.svg" className={HomeCss.small} loading='lazy' alt='bookent logo'/>
                    </Link>
                </div>

                <div className={HomeCss.addDiv}>
                    <Link to='/addBook'>
                        <img src="/assets/add.svg"  loading='lazy' alt='add book'/>
                    </Link>
                </div>

                <div className={HomeCss.infosDiv}>
                    <div className={HomeCss.menu} ref={refMenu}>

                        <div className={HomeCss.categs}>

                            <div id={HomeCss.categorys}>
                                <div className={HomeCss.navi}>
                                    <p>Category</p>
                                </div>
                                <div className={HomeCss.dropdown}>
                                    <nav>
                                        <ul>
                                            <button value={''} onClick={e => props.setGenere(e.target.value)}>All</button>
                                            {props.categoryList.map(category => (<button key={category} value={category} onClick={e => props.setGenere(e.target.value)}>{category}</button>))}
                                        </ul>
                                    </nav>
                                </div>
                            </div>

                            <div className={HomeCss.navi}>
                                <Link to='/chat'>
                                    <div>
                                        <p>Messages</p>
                                    </div>
                                </Link>
                            </div>

                            <div className={HomeCss.navi}>
                                <div onClick={logout}>
                                    <p>Log out</p>
                                </div>
                            </div>

                            <div className={`${HomeCss.navi}  ${HomeCss.countriesSelect}`}>
                                <div onClick={toggleCountry}>
                                    <p>change country</p>
                                </div>

                                <section className={HomeCss.countriesModal} ref={countryModal}>
                                    <h5>country</h5>
                                    <section className={HomeCss.countries}>
                                        <div className={HomeCss.country} onClick={() => {
                                            props.setCountry('')
                                            countryModal.current.style = 'display:none'
                                        }}>
                                            <p>Any country</p>
                                        </div>
                                        {props.countriesList.map(country => (
                                            <div className={HomeCss.country} key={country}
                                                onClick={() => {
                                                    props.setCountry(country)
                                                    countryModal.current.style = 'display:none'
                                                }}>
                                                <p>{country}</p>
                                            </div>
                                        ))}
                                    </section>
                                </section>
                            </div>
                        </div>

                        <div className={HomeCss.dark}>
                            <div className={HomeCss.toggleButtonCover}>
                                <div className={HomeCss.buttonCover}>
                                    <div className={`${HomeCss.button}  ${HomeCss.r}`} id={HomeCss.button3}>
                                        <input type="checkbox" className={HomeCss.checkbox} onChange={darkToggle} defaultChecked={localStorage.getItem('theme') === 'themedark' ? true : false} />
                                        <div className={HomeCss.knobs}></div>
                                        <div className={HomeCss.layer}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to='/profile'>
                            <div className={HomeCss.profile}>
                                <img src={user.profileImg && `${user.profileImg}` || '/assets/user.svg'} alt='profile' />
                                <span>{user.username}</span>
                            </div>
                        </Link>
                    </div>

                    <div className={HomeCss.hamDiv}>
                        <input type='checkbox' id={HomeCss.hamcheck} onChange={showMenu} />
                        <div id={HomeCss.ham}></div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default NavBar;
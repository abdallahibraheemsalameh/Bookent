import RestCss from './style.module.css';
import { Link } from 'react-router-dom'


function Welcome({categoryList ,scrollTohalf}) {


    return (
        <>

            <div className={RestCss.welcome}>
                <div className={RestCss.halfs}>
                    <div className={RestCss.half1}>
                        <div className={RestCss.phrases}>
                            <h1>
                                Find book some
                            </h1>
                            <h1>
                                <br />Where . . .
                            </h1>
                            <p>
                                to get that mind bigger
                            </p>
                        </div>

                        <button onClick={scrollTohalf}>Go Now !!!</button>
                    </div>

                    <div className={RestCss.half2}>
                        <img src="/assets/Group 18.svg" alt='shape'/>
                    </div>
                </div>

            </div>


            <div className={RestCss.routes}>
                <div className={RestCss.router}>
                <div>
                        <Link to='/yourBooks'>
                            <img src='/assets/book.svg' alt='your books page'/>
                            <h2>Your books</h2>
                        </Link>
                    </div>

                    <div>
                        <Link to='/home'>
                            <img src='/assets/home.svg' alt='home page'/>
                            <h2>Home</h2>
                        </Link>
                    </div>

                    <div>
                        <Link to='/favorites'>
                            <img src='/assets/lover.svg' alt='favourites page'/>
                            <h2>Favorites</h2>
                        </Link>
                    </div>
                </div>

            </div>

        </>
    );
}

export default Welcome;
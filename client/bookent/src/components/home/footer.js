import HomeCss from './style.module.css';
import { Link } from 'react-router-dom'
function Footer(props) {
    return (
        <>
            <footer>
                <div className={HomeCss.copyDiv}>
                    <span>@ 2021 copyright for Bookent Team</span>
                    <a href='mailto:bookenteto10@gmail.com'><span>Email us</span></a>
                </div>

                <ul>
                    <Link to='/home'>
                        <li>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li>About</li>
                    </Link>
                    <li onClick={props.logout}>Log out</li>
                </ul>

                <div className={HomeCss.logo2}>
                    <Link to='/home'>
                        <img src="/assets/bookent logo black.svg" alt='bookent logo'/>
                    </Link>
                </div>
            </footer>


        </>
    );
}

export default Footer

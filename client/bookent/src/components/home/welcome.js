import HomeCss from './style.module.css';
import { Link } from 'react-router-dom';

function Welcome(props) {
  return (
    <>
      <div className={HomeCss.welcome}>
        <div className={HomeCss.halfs}>
          <div className={HomeCss.half1}>
            <div className={HomeCss.phrases}>
              <h1>Lend Some Books</h1>
              <h1>
                <br />
                NOW . . .
              </h1>
              <p>Here Through BOOKENT</p>
            </div>

            <button onClick={props.scrollTohalf}>Go Now !!!</button>
          </div>

          <div className={HomeCss.half2}>
            <img src='/assets/Group 18.svg' alt='shape' />
          </div>
        </div>
      </div>

      <div className={HomeCss.routes}>
        <div className={HomeCss.router}>
          <div>
            <Link to='/yourBooks'>
              <img src='/assets/book.svg' alt='your books page' />
              <h2>Your books</h2>
            </Link>
          </div>

          <div>
            <Link to='/home'>
              <img src='/assets/home.svg' alt='home page' />
              <h2>Home</h2>
            </Link>
          </div>

          <div>
            <Link to='/favorites'>
              <img src='/assets/lover.svg' alt='favourite books page' />
              <h2>Favorites</h2>
            </Link>
          </div>
        </div>

        <div className={HomeCss.types}>
          <div>
            <h1>Browse All Types</h1>
          </div>
          <div className={HomeCss.typesround}>
            {props.categoryList.map((category) => (
              <div key={category}>
                <button
                  onClick={(e) => props.setGenere(e.target.value)}
                  value={category}
                >
                  {category}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;

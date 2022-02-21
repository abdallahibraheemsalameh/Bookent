import classes from './All.module.css';
import Man from '../assets/manWithChair.svg';

// import { useState } from 'react';

function LoginForm(props) {
  // const [signClicked, setSignClicked] = useState(false);
  function signClickedHandler() {
    props.onSignClicked(true);
  }
  return (
    <div>
      <div className={classes.Main__Container}>
        <div className={classes.Form__Container}>
          <form className={classes.logIn__form} onSubmit={props.logIn}>
            <div className={classes.headerLogin}>
              <h2>Log in</h2>
            </div>
            <label className={`${classes.userName__label} ${classes.labels}`}>
              <p className={classes.labelName}>username</p>
              <input
                type='text'
                className={`${classes.formInputs} ${classes.username}`}
                name='username'
                onChange={props.logChange}
                required
                autoFocus
              ></input>
            </label>

            <label className={`${classes.password__label} ${classes.labels}`}>
              <p className={classes.labelName}> password </p>
              <input
                type='password'
                className={`${classes.formInputs} ${classes.password}`}
                name='pass'
                onChange={props.logChange}
                required
              ></input>
            </label>

            {props.logErr &&<div className={classes.err}><h5>{props.logErr && <img src='/assets/err.svg' alt='error' />}{props.logErr}</h5></div>}

            <input
              type='submit'
              className={classes.formSubmit}
              value='Go!'
            ></input>
          </form>
          <div className={classes.signUp__div}>
            <button
              className={classes.signUp__btn}
              onClick={signClickedHandler}
            >
              <span className={classes.dontHavean__spam}>
                Don't Have an
                <span className={classes.Account}> Account?</span>
              </span>
              <br />
              <span className={classes.signUp__span}>Sign up &#8594;</span>
            </button>
          </div>
        </div>
        <div className={classes.manWithChair__div}>
          <img src={Man} loading='lazy' alt='logo' className={classes.manWithChair}></img>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;

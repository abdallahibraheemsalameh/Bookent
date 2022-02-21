import classes from './All.module.css';
import Man from '../assets/manWithChair.svg';
import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext'

function SignUpForm(props) {
  const {countriesList} = useContext(AuthContext)

  function logClickedHandler() {
    props.onSignClicked(true);
  }

  return (
    <div>

      <div className={classes.Main__Container__SignUp}>
        <div className={classes.Form__Container__SignUp}>
          <form className={classes.SignUp__form} onSubmit={props.signUp}>
            <div className={classes.headerSignUp}>
              <h2>Sign up</h2>
            </div>
            <label
              className={`${classes.userName__label} ${classes.labels__SignUp}`}
            >
              <p className={classes.labelName}>username</p>
              <input
                type='text'
                className={`${classes.formInputs__SignUp} ${classes.username}`}
                name='username'
                onChange={props.signChange}
                required
                autoFocus
              ></input>
            </label>
            {props.signErr &&<div className={classes.err}><h5 style={{marginTop:-20}}>{props.signErr && <img src='/assets/err.svg' alt='error' />}{props.signErr}</h5></div>}

            <label
              className={`${classes.password__label} ${classes.labels__SignUp}`}
            >
              <p className={classes.labelName}> password </p>
              <input
                type='password'
                className={`${classes.formInputs__SignUp} ${classes.password}`}
                name='pass'
                onChange={props.signChange}
                minLength='8'
                required
              ></input>
            </label>

            <label
              className={`${classes.phone__label} ${classes.labels__SignUp}`}
            >
              <p className={`${classes.labelName} ${classes.ppp}`}> phone </p>
              <input
                type="text" pattern="\d*" maxLength="10"
                className={`${classes.formInputs__SignUp} ${classes.telphone}`}
                name='phone'
                onChange={props.signChange}
                required
              ></input>
            </label>

            <label
              className={`${classes.country__label} ${classes.labels__SignUp}`}>
              <p className={`${classes.labelName} ${classes.pp}`}>country </p>

              <select
                className={`${classes.formInputs__SignUp} ${classes.country}`}
                name='country'
                onChange={props.signChange}
                required
              >
                {countriesList.map((country,i)=>(
                <option value={country} key={i}>{country}</option>
                ))}
              </select>
            </label>

            <input
              type='submit'
              className={classes.formSubmit__SignUp}
              value='Go!'
            ></input>
          </form>
          <div className={classes.signUp__div}>
            <button className={classes.signUp__btn} onClick={logClickedHandler}>
              <span className={classes.dontHavean__spam}>
                Already Have an
                <span className={classes.Account}> Account?</span>
              </span>
              <br />
              <span className={classes.signUp__span}>Log in &#8594;</span>
            </button>
          </div>
        </div>
        <div className={classes.manWithChair__div__SignUp}>
          <img
            src={Man}
            loading='lazy'
            alt='logo'
            className={classes.manWithChair__SignUp}
          ></img>
        </div>
      </div>
    </div>
  );
}
export default SignUpForm;

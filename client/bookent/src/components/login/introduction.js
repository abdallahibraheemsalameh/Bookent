import Man from '../assets/manWithChair.svg';

// import classes from './introduction.module.css';
import classes from './All.module.css';
function Introduction(props) {
  function JoinNowHandler() {
    props.onShowClicked(false);
  }
  return (
    <div>
      <div className={classes.introduction__container}>
        <div className={classes.readMore__div}>
          <h2 className={classes.readMore__header}>
            <span className={classes.readeMore__span}>Read More </span>
            <span className={classes.learnMore__span}>Learn More </span>
          </h2>
          <section className={classes.readMore__P1}>
            <h2> What is bookent ?</h2>
            <span>
              BOOKENT is a web application that aims to simplify the process of
              book rental between readers who prefer to own the printed copy of
              books.
            </span>
          </section>

          <section className={classes.readMore__P2}>
            <h2> Why is bookent ?</h2>
            <span>
              Reading books is very important in our life since it keeps the
              brain alive and healthy. However, recently in our society, it has
              received less attention. One of the major reasons is the invention
              of smartphones and other Internet-based devices which makes books
              easily available.
            </span>
          </section>
        </div>
        <div className={classes.joinNow__btn__div}>
          <button className={classes.joinNow__btn} onClick={JoinNowHandler}>
            {' '}
            join now
          </button>
        </div>
        <div className={classes.manWithChair__div__intro}>
          <img
            src={Man}
            loading='lazy'
            alt='logo'
            className={classes.manWithChair__intro}
          ></img>
        </div>
      </div>
    </div>
  );
}
export default Introduction;

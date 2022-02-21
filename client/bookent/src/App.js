import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { VerifyAuth } from './VerifyAuth'
import Chat from './components/chat';
const Login = lazy(() => import('./components/login'))
const Home = lazy(() => import('./components/home'))
const BookDetails = lazy(() => import('./components/bookDetails'))
const Favorites = lazy(() => import('./components/favorites'))
const YourBooks = lazy(() => import('./components/yourBooks'))
const AddBook = lazy(() => import('./components/addBook'))
const EditProfile = lazy(() => import('./components/editProfile'))
const EditBook = lazy(() => import('./components/editBook'))
const About = lazy(() => import('./components/about'))

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div id='loader'>
          <div className='clones2'></div>
        </div>}>
          <Switch>


            <Redirect exact from='/' to='/login' />

            <Route exact path='/home'>
              <VerifyAuth>
                <Home />
              </VerifyAuth>
            </Route>

            <Route exact path='/login'>
              <Login />
            </Route>

            <Route path="/Book/:id">
              <VerifyAuth>
                <BookDetails />
              </VerifyAuth>
            </Route>

            <Route path="/yourBooks">
              <VerifyAuth>
                <YourBooks />
              </VerifyAuth>
            </Route>

            <Route path="/favorites">
              <VerifyAuth>
                <Favorites />
              </VerifyAuth>
            </Route>

            <Route path="/profile">
              <VerifyAuth>
                <EditProfile />
              </VerifyAuth>
            </Route>

            <Route path="/addBook">
              <VerifyAuth>
                <AddBook />
              </VerifyAuth>
            </Route>

            <Route path="/editBook/:id">
              <VerifyAuth>
                <EditBook />
              </VerifyAuth>
            </Route>

            <Route path="/about">
              <About />
            </Route>

            <Route path="/chat">
              <VerifyAuth>
                <Chat />
              </VerifyAuth>
            </Route>


          </Switch>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;

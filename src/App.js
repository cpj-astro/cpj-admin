import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import React, {Fragment} from 'react';
import PrivateRoute from './auth-files/PrivateRoute';
import Dashboard from './containers/dashboard';
import AddMatch from './containers/matches/AddMatch';
import InputExample from './containers/InputExample';
import LiveMatches from './containers/matches/LiveMatches';
import UpcomingMatches from './containers/matches/UpcomingMatches';
import RecentMatches from './containers/matches/RecentMatches';
import SeriesList from './containers/series';
import Users from './containers/users/Users';
import AddPandit from './containers/pandits/AddPandit';
import PanditsList from './containers/pandits/PanditsList';
import EditPandit from './containers/pandits/EditPandit';
import AddPlayer from './containers/players/AddPlayer';
import PlayersList from './containers/players/PlayersList';
import EditPlayer from './containers/players/EditPlayer';
import CupRates from './containers/cuprates';
import LiveMatchControl from './containers/matches/LiveMatchControl';
import SignIn from './containers/auth/SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className='wrapper'>
      <Router>
        <Fragment>
          <Routes>
            <Route exact path='/' element={<PrivateRoute/>}>
              {/* Dashboard Routes */}
              <Route path="/" element={<Dashboard/>} />

              {/* Matches Routes */}
              <Route path="/add-match" element={<AddMatch/>} />
              <Route path="/input-example" element={<InputExample/>} />
              <Route path="/live-matches" element={<LiveMatches/>} />
              <Route path="/upcoming-matches" element={<UpcomingMatches/>} />
              <Route path="/recent-matches" element={<RecentMatches/>} />
              <Route path="/live-match-control/:id" element={<LiveMatchControl/>} />
              
              {/* Series Routes */}
              <Route path="/series-list" element={<SeriesList/>} />

              {/* Users Routes */}
              <Route path="/users-list" element={<Users/>} />

              {/* Pandits Routes */}
              <Route path="/add-pandit" element={<AddPandit/>} />
              <Route path="/pandits-list" element={<PanditsList/>} />
              <Route path="/edit-pandit/:id" element={<EditPandit/>} />

              {/* Players Routes */}
              <Route path="/add-player" element={<AddPlayer/>} />
              <Route path="/players-list" element={<PlayersList/>} />
              <Route path="/edit-player/:id" element={<EditPlayer/>} />

              {/* Cup Rates */}
              <Route path="/cup-rates" element={<CupRates/>} />
            </Route>
            <Route path='/login' element={<SignIn/>}/>
          </Routes>
        </Fragment>
      <ToastContainer />
      </Router>
    </div>
  )
}

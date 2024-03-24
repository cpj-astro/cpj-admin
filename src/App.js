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
import CreateKundli from './containers/kundlis/CreateKundli';
import UploadAstrologyData from './containers/astrology/UploadAstrologyData';
import ViewAstrologyData from './containers/astrology/ViewAstrologyData';
import AddMatchAstrology from './containers/matches/AddMatchAstrology';
import ManageAds from './containers/privateads/ManageAds';
import ManageReviews from './containers/reviews/ManageReviews';
import UserDetails from './containers/users/UserDetails';
import ManageGameJob from './containers/gamejob/ManageGameJob';
import ManageVisitors from './containers/visitors/ManageVisitors';
import ManageTeams from './containers/teams/ManageTeams';
import AskedQuestions from './containers/questions/AskedQuestions';
import ManageGlobalPrice from './containers/globalprice/GlobalPrice';
import AddFaq from './containers/faq/AddFaq';
import FaqList from './containers/faq/FaqList';
import EditFaq from './containers/faq/EditFaq';

export default function App() {
  return (
    <div className='wrapper'>
      <Router basename={process.env.REACT_APP_PUBLIC_URL}>
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
              <Route path="/add-match-astrology/:id/:matchName" element={<AddMatchAstrology/>} />
              
              {/* Series Routes */}
              <Route path="/series-list" element={<SeriesList/>} />

              {/* Users Routes */}
              <Route path="/users-list" element={<Users/>} />
              <Route path="/user-details/:id" element={<UserDetails/>} />

              {/* Pandits Routes */}
              <Route path="/add-pandit" element={<AddPandit/>} />
              <Route path="/pandits-list" element={<PanditsList/>} />
              <Route path="/edit-pandit/:id" element={<EditPandit/>} />

              {/* Faqs Routes */}
              <Route path="/add-faq" element={<AddFaq/>} />
              <Route path="/faqs-list" element={<FaqList/>} />
              <Route path="/edit-faq/:id" element={<EditFaq/>} />

              {/* Players Routes */}
              <Route path="/add-player" element={<AddPlayer/>} />
              <Route path="/players-list" element={<PlayersList/>} />
              <Route path="/edit-player/:id" element={<EditPlayer/>} />

              {/* Cup Rates */}
              <Route path="/cup-rates" element={<CupRates/>} />
              
              {/* Kundli Routes */}
              <Route path="/create-kundli" element={<CreateKundli/>} />

              {/* Astrology Routes */}
              <Route path="/upload-astrology-data" element={<UploadAstrologyData/>} />
              <Route path="/view-astrology-data" element={<ViewAstrologyData/>} />

              {/* Ads Routes */}
              <Route path="/manage-ads" element={<ManageAds/>} />

              {/* Reviews Routes */}
              <Route path="/manage-reviews" element={<ManageReviews/>} />

              {/* GameJob Routes */}
              <Route path="/manage-gamejob" element={<ManageGameJob/>} />

              {/* Global Price Routes */}
              <Route path="/manage-global-price" element={<ManageGlobalPrice/>} />

              {/* Visitors Routes */}
              <Route path="/manage-visitors" element={<ManageVisitors/>} />

              {/* Asked Questions Routes */}
              <Route path="/asked-questions" element={<AskedQuestions/>} />

              {/* Teams Routes */}
              <Route path="/manage-teams/:id" element={<ManageTeams/>} />
              <Route path="/manage-teams/:id" element={<ManageTeams/>} />
            </Route>
            <Route path='/login' element={<SignIn/>}/>
          </Routes>
        </Fragment>
        <ToastContainer />
      </Router>
    </div>
  )
}

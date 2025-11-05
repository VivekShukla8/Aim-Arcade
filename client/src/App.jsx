import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import HomePage from './pages/Home.jsx';
import AboutPage2 from './pages/About.jsx';
import ContactPage from './pages/Contact.jsx';
import OwnerPage from './pages/Owner.jsx';
import OwnerParticipantsPage from './pages/OwnerParticipants.jsx';
import PayTeamPage from './pages/PayTeam.jsx';
import PayPlayerPage from './pages/PayPlayer.jsx';
import LoginPage from './pages/Login.jsx';
import AuthPage from './pages/Auth.jsx';
import TournamentsPage from './pages/Tournaments.jsx';
import TournamentDetailPage from './pages/TournamentDetail.jsx';
import RegisterTeamPage from './pages/RegisterTeam.jsx';
import JoinTeamPage from './pages/JoinTeam.jsx';
import MyRegsPage from './pages/MyRegs.jsx';
import TeamDetailsPage from './pages/TeamDetails.jsx';
import ProfilePage from './pages/Profile.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/about" element={<AboutPage2/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/tournaments" element={<TournamentsPage/>} />
        <Route path="/t/:id" element={<TournamentDetailPage/>} />
        <Route path="/register/:tournamentId" element={<RegisterTeamPage/>} />
        <Route path="/join/:teamCode" element={<JoinTeamPage/>} />
        <Route path="/team/:registrationId" element={<TeamDetailsPage/>} />
        <Route path="/pay/team/:registrationId" element={<PayTeamPage/>} />
        <Route path="/pay/player/:registrationId" element={<PayPlayerPage/>} />
        <Route path="/owner/t/:tournamentId/participants" element={<OwnerParticipantsPage/>} />
        <Route path="/my" element={<MyRegsPage/>} />
        <Route path="/owner" element={<OwnerPage/>} />
        <Route path="/user" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}


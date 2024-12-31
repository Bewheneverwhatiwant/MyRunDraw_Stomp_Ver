import { Routes, Route } from 'react-router-dom';
import Mobile from './layouts/Mobile';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import GamePage from './pages/GamePage/GamePage';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Mobile />}>
        <Route index element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="game/:roomId" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

export default Router;

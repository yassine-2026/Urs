/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Play from './pages/Play';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/play/:gameId" element={<Play />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

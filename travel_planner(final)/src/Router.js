import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Create } from './home_components/index';
import { Plan, Complete } from './calendar_components/index';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Create" element={<Create />} />
      <Route path="/Plan" element={<Plan />} />
      <Route path="/Complete" element={<Complete />} />
    </Routes>
  );
}

export default Router;
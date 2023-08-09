import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { LinksPage } from './pages/LinksPage'
import { DetailPage } from './pages/DetailPage'
import { SeasonPage } from './pages/SeasonPage'
import { TourPage } from './pages/TourPage'
import { CreatePage } from './pages/CreatePage'
import { AuthPage } from './pages/AuthPage'

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route>
          <Route path="/links" element={<LinksPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/seasons/:season" element={<SeasonPage />} />
          <Route path="/seasons/:season/:tour" element={<TourPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/seasons/2023-24" />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route>
        <Route path="/" element={<AuthPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

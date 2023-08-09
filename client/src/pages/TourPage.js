import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { TourCard } from '../components/TourCard'

export const TourPage = () => {
  const { token } = useContext(AuthContext)
  const { request, loading } = useHttp()
  const [tourInfo, setTourInfo] = useState(null)
  const season = useParams().season
  const tour = useParams().tour

  const getTour = useCallback(async () => {
    try {
      const fetched = await request(
        `/api/seasons/${season}/${tour}`,
        'GET',
        null,
        {
          Authorisation: `Bearer ${token}`,
        }
      )
      setTourInfo(fetched)
    } catch (e) {}
  }, [token, season, tour, request])

  useEffect(() => {
    getTour()
  }, [getTour])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {!loading && tourInfo && (
        <TourCard tourInfo={tourInfo} tour={tour} season={season} />
      )}
    </>
  )
}

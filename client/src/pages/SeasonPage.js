import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { SeasonCard } from '../components/SeasonCard'

export const SeasonPage = () => {
  const { token } = useContext(AuthContext)
  const { request, loading } = useHttp()
  const [seasonInfo, setSeasonInfo] = useState(null)
  const season = useParams().season

  const getQty = useCallback(async () => {
    try {
      const fetched = await request(`/api/seasons/${season}`, 'GET', null, {
        Authorisation: `Bearer ${token}`,
      })
      setSeasonInfo(fetched)
    } catch (e) {}
  }, [token, season, request])

  useEffect(() => {
    getQty()
  }, [getQty])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {!loading && seasonInfo && (
        <SeasonCard
          quantity={seasonInfo.tour_quantity}
          season={seasonInfo.season}
        />
      )}
    </>
  )
}

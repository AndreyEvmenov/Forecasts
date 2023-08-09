import React, { useContext, useState, useEffect, useCallback } from 'react'
import { MatchCard } from './MatchCard'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { TourTable } from './TourTable'
import styles from './TourCard.module.css'

export const TourCard = (props) => {
  const tour = props.tour
  const season = props.season
  const tourInfo = props.tourInfo.sort(
    (a, b) => Date.parse(a.date) - Date.parse(b.date)
  )

  const { loading, request } = useHttp()
  const { token } = useContext(AuthContext)
  const [membersAndNames, setMembers] = useState({})
  const [table, setTable] = useState([])

  const loadTable = useCallback(async () => {
    try {
      const fetched = await request(
        `/api/seasons/${season}/${tour}/table`,
        'GET',
        null,
        {
          Authorisation: `Bearer ${token}`,
        }
      )
      setTable(fetched)
    } catch (e) {}
  }, [token, request, season, tour])

  const loadMembers = useCallback(async () => {
    try {
      const fetched = await request(
        `/api/seasons/members/${season}`,
        'GET',
        null,
        {
          Authorisation: `Bearer ${token}`,
        }
      )
      setMembers(fetched)
    } catch (e) {}
  }, [token, request, season])

  useEffect(() => {
    loadTable()
    loadMembers()
  }, [loadTable, loadMembers])

  return (
    <>
      <h2>
        Матчи {tour} тура {season}
      </h2>
      <div className={styles.tours}>
        {tourInfo.map((match) => {
          return <MatchCard key={match._id} match={match} />
        })}
      </div>
      <>
        {!loading && Object.keys(membersAndNames).length !== 0 && table && (
          <TourTable membersAndNames={membersAndNames} table={table} />
        )}
      </>
    </>
  )
}

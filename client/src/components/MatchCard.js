import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import styles from './MatchCard.module.css'

export const MatchCard = ({ match }) => {
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const [form, setForm] = useState({
    score1: 0,
    score2: 0,
  })
  const [forecast, setForecast] = useState({
    f1: match.forecast.length === 0 ? ' x' : match.forecast[0].score1,
    f2: match.forecast.length === 0 ? ' x' : match.forecast[0].score2,
  })

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const prepDate = (date) => {
    const datePrep = new Date(date)
    const day = datePrep.getDate()
    let month = ''
    if (datePrep.getMonth().toString().length === 2) {
      month = datePrep.getMonth() + 1
    } else {
      month = '0' + (datePrep.getMonth() + 1)
    }
    const year = datePrep.getFullYear()
    const week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const weekday = week[datePrep.getDay()]
    const hour = datePrep.getHours()
    let min = ''
    if (datePrep.getMinutes().toString().length === 1) {
      min = '0' + datePrep.getMinutes()
    } else {
      min = datePrep.getMinutes()
    }

    return `${day}.${month}.${year} ${weekday} ${hour}:${min}`
  }

  const sendHandler = async (score1, score2, matchId) => {
    try {
      await request(
        '/api/seasons/forecast',
        'POST',
        {
          score1,
          score2,
          match: matchId,
          date: new Date(),
        },
        { Authorisation: `Bearer ${auth.token}` }
      )

      setForm({ score1: 0, score2: 0 })
      setForecast({ f1: score1, f2: score2 })
    } catch (e) {}
  }

  return (
    <>
      <div key={match._id} className={styles.matchblock}>
        <div>
          <div className={styles.date}>{prepDate(match.date)}</div>
          <span>
            {match.team1} - {match.team2}
          </span>

          <span>
            {match.score1 === -1 ? '-' : match.score1} :{' '}
            {match.score2 === -1 ? '-' : match.score2}
          </span>
        </div>
        <div className={styles.score}>
          {'Мой прогноз:   '}
          {forecast.f1}
          {' - '}
          {forecast.f2}
          {true ? (
            <>
              <input
                placeholder="-"
                id="score1"
                type="number"
                name="score1"
                value={form.score1}
                onChange={changeHandler}
              />
              <input
                placeholder="-"
                id="score2"
                type="number"
                name="score2"
                value={form.score2}
                onChange={changeHandler}
              />

              <button
                onClick={() => sendHandler(form.score1, form.score2, match._id)}
              >
                Отправить
              </button>
            </>
          ) : (
            ''
          )}

          {/* <>
            <input
              placeholder="-"
              id="score1"
              type="number"
              name="score1"
              value={form.score1}
              onChange={changeHandler}
            />
            <input
              placeholder="-"
              id="score2"
              type="number"
              name="score2"
              value={form.score2}
              onChange={changeHandler}
            />

            <button
              onClick={() => sendHandler(form.score1, form.score2, match._id)}
            >
              Отправить
            </button>
          </> */}
        </div>
      </div>
    </>
  )
}

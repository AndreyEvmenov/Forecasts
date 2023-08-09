import React, { useContext, useEffect, useCallback, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const history = useNavigate()
  const auth = useContext(AuthContext)

  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout()
    history('/')
  }

  const { request } = useHttp()
  const [seasons, setSeasons] = useState([])
  const { token } = useContext(AuthContext)

  const fetchSeasons = useCallback(async () => {
    try {
      const fetched = await request('/api/seasons', 'GET', null, {
        Authorisation: `Bearer ${token}`,
      })
      setSeasons(fetched)
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchSeasons()
  }, [fetchSeasons])

  return (
    <nav>
      <div className={styles.myNav}>
        <div className={styles.menuHeader}>Сезоны</div>

        {seasons.map((item) => {
          return (
            <div key={item._id} className={styles.menuItem}>
              <NavLink to={`/seasons/${item.season}`}>{item.season}</NavLink>
            </div>
          )
        })}
        {/* <div className={styles.menuItem}>
          <NavLink to="/create">Создать</NavLink>
        </div>
        <div className={styles.menuItem}>
          <NavLink to="/links">Ссылки</NavLink>
        </div> */}
        <div className={styles.menuItem}>
          <a href="/" onClick={logoutHandler}>
            Выйти
          </a>
        </div>
      </div>
    </nav>
  )
}

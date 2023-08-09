import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './SeasonCard.module.css'

export const SeasonCard = ({ quantity, season }) => {
  const tours = Array.from(Array(quantity), (_, index) => index + 1)
  return (
    <>
      <h2>Туры сезона {season}</h2>
      <div className={styles.container}>
        {tours.map((tour) => (
          <div key={tour} className={styles.tour}>
            <NavLink to={`/seasons/${season}/${tour}`}> {tour} </NavLink>
          </div>
        ))}
      </div>
    </>
  )
}

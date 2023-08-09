import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from './Tables.module.css'

export const TourTable = ({ membersAndNames, table }) => {
  table = table.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))

  let members = []
  membersAndNames.season.members.map((member, index) =>
    table.map((item) =>
      item.forecast.forEach((elem) => {
        if (elem.owner === member) {
          members[index] = { id: member, name: elem.user[0].name }
        }
      })
    )
  )

  table.forEach((match) => {
    match.forecast.forEach((forecast) => {
      forecast.points = 0
      if (
        (match.score1 !== -1 || match.score2 !== -1) &&
        ((match.score1 > match.score2 && forecast.score1 > forecast.score2) ||
          (match.score1 < match.score2 && forecast.score1 < forecast.score2))
      ) {
        forecast.points = 1
      }

      if (
        (match.score1 !== -1 || match.score2 !== -1) &&
        match.score1 - forecast.score1 === match.score2 - forecast.score2
      ) {
        forecast.points = 2
      }

      if (
        match.score1 === forecast.score1 &&
        match.score2 === forecast.score2
      ) {
        forecast.points = 3
      }

      if (
        match.score1 === forecast.score1 &&
        match.score2 === forecast.score2 &&
        (match.score1 - match.score2 >= 3 || match.score2 - match.score1 >= 3)
      ) {
        forecast.points = 4
      }
    })
  })

  let tourResult = []

  members.forEach((member) => tourResult.push({ member: member.id, result: 0 }))

  tourResult.forEach((member) =>
    table.forEach((match) =>
      match.forecast.forEach((forecast) => {
        if (member.member === forecast.owner) {
          member.result += forecast.points
        }
      })
    )
  )

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Матч</th>
            <th>Счет</th>
            {members.map((member, index) => (
              <th key={index}>{member.name}</th>
            ))}
          </tr>
          <tr>
            <th> </th>
            <th> </th>
            {members.map((member, index) => (
              <th key={index}>
                <>{'Сч '}</>
                <>{' О'}</>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((match, index) => (
            <tr key={index}>
              <td>{`${match.team1} - ${match.team2}`}</td>
              <td>{`${match.score1 === -1 ? '-' : match.score1} :
               ${match.score2 === -1 ? '-' : match.score2}`}</td>
              {members.map((member, i) => {
                const cell = match.forecast.find((el) => el.owner === member.id)

                return (
                  <td key={i}>
                    <>{`${typeof cell !== 'undefined' ? cell.score1 : '-'}:${
                      typeof cell !== 'undefined' ? cell.score2 : '-'
                    } `}</>
                    <>{` ${typeof cell !== 'undefined' ? cell.points : '-'}`}</>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Очков за тур:</td>
            <td></td>
            {tourResult.map((member, index) => {
              return <td key={index}>{member.result}</td>
            })}
          </tr>
        </tfoot>
      </table>
    </>
  )
}

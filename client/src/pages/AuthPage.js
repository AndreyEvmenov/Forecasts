import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const { loading, request, error, clearError } = useHttp()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // const registerHandler = async () => {
  //   try {
  //     const data = await request('/api/auth/register', 'POST', { ...form })
  //     message(data.message)
  //   } catch (e) {}
  // }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form })
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div>
      <div>
        <div className={styles.card}>
          <div>
            <span className={styles.cardtitle}>Авторизация</span>
            <div>
              <div>
                <input
                  placeholder="Введите e-mail"
                  id="email"
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                />
                {/* <label htmlFor="email">Email</label> */}
              </div>
              <div>
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                />
                {/* <label htmlFor="email">Password</label> */}
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={loginHandler}
              disabled={loading}
            >
              Войти
            </button>
            {/* <button
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', '## Некорректный email ##').isEmail(),
    check('password', '## Неверный пароль ##').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: '## Некорректные данные при регистрации ##',
        })
      }

      const { email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res
          .status(400)
          .json({ message: '## Такой пользователь уже существует ##' })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()

      res.status(201).json({ message: 'Пользователь успешно создан' })
    } catch (e) {
      res.status(500).json({ message: '## Что-то пошло не так ##' })
    }
  }
)

// /api/auth/login
router.post(
  '/login',
  [
    check('email', '## Некорректный email или нет такого пользователя ##')
      .normalizeEmail()
      .isEmail(),
    check('password', '## Неверный пароль ##').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: '--Incorrect login data',
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: '--Incorrect login data' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: '--Incorrect login data' })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '3h',
      })

      res.json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Somthing went wrong..//..' })
    }
  }
)

module.exports = router

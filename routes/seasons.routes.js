const { Router } = require('express')
const { Types } = require('mongoose')
const Seasons = require('../models/Season')
const Matches = require('../models/Match')
const Forecast = require('../models/Forecast')
const Users = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const seasons = await Seasons.find()
    res.json(seasons)
  } catch (e) {
    res.status(500).json({ message: '## Что-то пошло не так (Seasons) ##' })
  }
})

router.get('/members/:season', auth, async (req, res) => {
  try {
    const season = await Seasons.findOne({ season: req.params.season })
    const users = await Users.find()

    res.json({ season, users })
  } catch (e) {
    res.status(500).json({
      message: '## Что-то пошло не так (members) ##',
      e: e.message,
    })
  }
})

router.get('/:season', auth, async (req, res) => {
  try {
    const oneSeason = await Seasons.findOne({ season: req.params.season })
    res.json(oneSeason)
  } catch (e) {
    res.status(500).json({ message: '## Что-то пошло не так (season_page) ##' })
  }
})

router.post('/forecast', auth, async (req, res) => {
  const { match, score1, score2 } = req.body
  let matchDate = new Date()
  const existing = await Forecast.findOne({ match, owner: req.user.userId })

  try {
    const fetchMatch = await Matches.findOne({ _id: match })
    matchDate = fetchMatch.date
  } catch (e) {}

  if (!existing) {
    try {
      const forecast = new Forecast({
        score1,
        score2,
        match,
        owner: req.user.userId,
      })

      if (true) await forecast.save()

      res.status(201).json({ forecast })
    } catch (e) {
      res.status(500).json({ message: '## Что-то пошло не так (forecast) ##' })
    }
  } else {
    existing.score1 = score1
    existing.score2 = score2
    existing.date = new Date().getTime()

    if (matchDate > new Date().getTime()) await existing.save()

    res.status(201).json({ existing })
  }
})

router.get('/:season/:tour/', auth, async (req, res) => {
  try {
    const oneTour = await Matches.aggregate([
      {
        $match: {
          season: req.params.season,
          tour: Number(req.params.tour),
        },
      },
      {
        $lookup: {
          from: 'forecasts', // this should be your collection name for candidates.
          localField: '_id', // there should be an attribute named candidateId in interview model that refer to candidate collection
          foreignField: 'match',
          pipeline: [
            { $match: { owner: new Types.ObjectId(req.user.userId) } },
            { $project: { _id: 0, match: 0, owner: 0, __v: 0, date: 0 } },
          ],
          as: 'forecast',
        },
      },
    ])

    res.json(oneTour)
  } catch (e) {
    res.status(500).json({
      message: '## Что-то пошло не так (userForecast) ##',
      e: e.message,
    })
  }
})

router.get('/:season/:tour/table', auth, async (req, res) => {
  try {
    const oneTour = await Matches.aggregate([
      {
        $match: {
          season: req.params.season,
          tour: Number(req.params.tour),
        },
      },
      { $project: { tour: 0, __v: 0, season: 0 } },
      {
        $lookup: {
          from: 'forecasts', // this should be your collection name for candidates.
          localField: '_id', // there should be an attribute named candidateId in interview model that refer to candidate collection
          foreignField: 'match',
          pipeline: [
            { $project: { _id: 0, match: 0, __v: 0, date: 0 } },
            {
              $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      links: 0,
                      __v: 0,
                      email: 0,
                      password: 0,
                      role: 0,
                    },
                  },
                ],
                as: 'user',
              },
            },
          ],
          as: 'forecast',
        },
      },
    ])

    res.json(oneTour)
  } catch (e) {
    res.status(500).json({
      message: '## Что-то пошло не так (userForecast) ##',
      e: e.message,
    })
  }
})

module.exports = router

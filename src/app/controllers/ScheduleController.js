const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment, User } = require('../models')

class ScheduleController {
  async index (req, res) {
    const date = moment(parseInt(req.query.date))
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00'
    ]

    const apps = schedule.map(time => {
      const [hour, minute] = time.split(':')

      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      const appointment = appointments.find(
        a => moment(a.date).format('HH:mm') === time
      )

      let user = null

      if (appointment) {
        user = appointment.user
      }

      return {
        time,
        value: value.format(),
        username: user ? user.name : null,
        useravatar: user ? user.avatar : null,
        available: value.isAfter(moment())
      }
    })

    return res.render('schedule/index', { apps })
  }
}

module.exports = new ScheduleController()

const { User } = require('../models')

class DashboardController {
  async index (req, res) {
    const { provider, id } = req.session.user

    if (provider) {
      const provider = await User.findByPk(id)
      return res.render('dashboard/provider', {
        provider
      })
    }

    const providers = await User.findAll({
      where: {
        provider: true
      }
    })

    return res.render('dashboard/client', { providers })
  }

  async provider (req, res) {}
}

module.exports = new DashboardController()

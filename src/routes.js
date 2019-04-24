const express = require('express')
const routes = express.Router()
const multerCfg = require('./config/multer')
const upload = require('multer')(multerCfg)

const authMid = require('./app/middlewares/auth')
const guestMid = require('./app/middlewares/guest')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const DashboardController = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/AvailableController')
const ScheduleController = require('./app/controllers/ScheduleController')

routes.use((req, res, next) => {
  res.locals.flashSucess = req.flash('sucess')
  res.locals.flashError = req.flash('error')
  return next()
})

routes.get('/files/:file', FileController.show)

routes.get('/', guestMid, SessionController.create)

routes.post('/signin', SessionController.store)

routes.get('/signup', guestMid, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

routes.use('/app', authMid)

routes.get('/app/dashboard', DashboardController.index)

routes.get('/app/logout', SessionController.destroy)

routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.post('/app/appointments/new/:provider', AppointmentController.store)

routes.get('/app/available/:provider', AvailableController.index)
routes.get('/app/schedule', ScheduleController.index)

module.exports = routes

const router = require('express').Router();
const moment = require('moment');
require('moment-duration-format');

const humanize = function (seconds) {
  const duration = moment.duration(seconds, 'seconds');
  const formatted = duration.format('m [months, ]w [weeks, ]d [days, ]h [hours, ]m [minutes, ]s [seconds]');

  return formatted;
};


router.get('/', (req, res) => {
  const uptime = Math.floor(process.uptime());
  
  const data = {
    uptime: humanize(uptime),
    status: 'Hello World',
    date: new Date(),
  };

  res.status(200).json(data);
});

module.exports = router;

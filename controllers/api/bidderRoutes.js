const router = require('express').Router();
const { Bidder } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
    const bidderData = await Bidder.create(req.body);

    req.session.save(() => {
      req.session.user_id = bidderData.id;
      req.session.logged_in = true;

      res.status(200).json(bidderData);
    });
  } catch (err) {
    //added console log
    console.error(err)
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const bidderData = await Bidder.findOne({
      where: { email: req.body.email },
    });

    if (!bidderData) {
      res
        .status(400)
        .json({ message: 'Wrong email/password, please try again' });
      return;
    }

    const validPassword = await bidderData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Wrong email/password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = bidderData.id;
      req.session.logged_in = true;

      res.json({ bidder: bidderData, message: 'Successfully logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;

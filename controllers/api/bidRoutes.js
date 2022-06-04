const router = require('express').Router();
const req = require('express/lib/request');
const { Bids } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newBid = await Bids.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newBid);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
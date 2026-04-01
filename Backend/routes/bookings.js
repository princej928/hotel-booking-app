const express = require('express');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/bookings
router.post('/', async (req, res) => {
  const { user, hotel, date } = req.body;

  try {
    const booking = await Booking.create({
      user,
      hotel,
      date
    });
    
    // Populate references to send back useful data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('hotel', 'name location price');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/bookings/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id })
      .populate('hotel', 'name location price')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/bookings/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

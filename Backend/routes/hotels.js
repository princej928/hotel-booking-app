const express = require('express');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/hotels
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, location, price, image, gallery } = req.body;

  try {
    const hotel = await Hotel.create({
      name,
      location,
      price,
      image,
      gallery
    });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/hotels/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    await Booking.deleteMany({ hotel: req.params.id });
    res.json({ message: 'Hotel removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

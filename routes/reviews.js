const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// 1. Naya review save karne ka rasta (POST)
router.post('/', async (req, res) => {
    try {
        const newReview = new Review({
            name: req.body.name,
            mobile: req.body.mobile,
            text: req.body.text,
            rating: req.body.rating
        });
        await newReview.save();
        res.status(201).json({ message: "Review successfully saved!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Review save karne mein error aayi" });
    }
});

// 2. Saare reviews dikhane ka rasta (GET)
router.get('/', async (req, res) => {
    try {
        // sort({ date: -1 }) se naye reviews sabse upar aayenge
        const reviews = await Review.find().sort({ date: -1 }); 
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Reviews fetch karne mein error aayi" });
    }
});

module.exports = router;
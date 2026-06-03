const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/photo'); // Tumhara database model

// 1. Photos Upload karne ka setup (Multer)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ----------------------------------------------------
// 2. GET ALL PHOTOS (Website ke Portfolio & Slider ke liye)
// ----------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos);
    } catch (error) {
        console.error("Photos fetch error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// ----------------------------------------------------
// 3. GET PHOTOS BY CATEGORY (Admin Panel Dropdown ke liye)
// ----------------------------------------------------
router.get('/category/:category', async (req, res) => {
    try {
        // Dropdown se jo category aayegi, uski photos db se nikalenge
        const photos = await Photo.find({ category: new RegExp(req.params.category, 'i') });
        res.json(photos);
    } catch (error) {
        console.error("Category fetch error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// ----------------------------------------------------
// 4. UPLOAD PHOTO (Admin panel se nayi photo dalne ke liye)
// ----------------------------------------------------
router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const newPhoto = new Photo({
            title: req.body.title || 'Studio Photo',
            category: req.body.category,
            // Windows path fix:
            imagePath: req.file.path.replace(/\\/g, "/") 
        });
        
        await newPhoto.save();
        res.status(200).json({ message: "Upload successful!", photo: newPhoto });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload photo" });
    }
});

// ----------------------------------------------------
// 5. DELETE PHOTO (Admin panel se Delete button ke liye)
// ----------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Failed to delete photo" });
    }
});

module.exports = router;
const mongoose = require('mongoose');

// Database ka structure (Schema)
const photoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    imagePath: { 
        type: String, 
        required: true 
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Photo', photoSchema);
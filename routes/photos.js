const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/photo'); // Chhota 'p' (Jo humne pehle fix kiya tha)

// 1. Upload Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 2. GET ALL PHOTOS
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.json(photos);
    } catch (error) {
        console.error("Photos fetch error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// 3. GET PHOTOS BY CATEGORY
router.get('/category/:category', async (req, res) => {
    try {
        const photos = await Photo.find({ category: req.params.category });
        res.json(photos);
    } catch (error) {
        console.error("Category fetch error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// 4. UPLOAD MULTIPLE PHOTOS (Asli Magic Yahan Hai ✨)
// 'photos' naam rakha hai aur limit 50 photos ek baar mein kar di hai
router.post('/upload', upload.array('photos', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Koi photo select nahi ki gayi." });
        }

        const category = req.body.category;
        
        // Har ek photo ko database mein save karne ke liye loop
        for (let i = 0; i < req.files.length; i++) {
            const newPhoto = new Photo({
                title: 'Studio Photo',
                category: category,
                imagePath: req.files[i].path.replace(/\\/g, "/") 
            });
            await newPhoto.save();
        }
        
        res.status(200).json({ message: `${req.files.length} Photos upload successful!` });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload photos" });
    }
});

// 5. DELETE PHOTO
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
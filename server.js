// YEH LINE CHHUT GAYI THI! Ise sabse upar rakhna hai:
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = express();

// 1. CORS Middleware (Frontend block na ho)
app.use(cors());

// 2. Body Parser (Data read karne ke liye)
app.use(express.json());

// 3. Static Folder (Purani local photos browser mein dikhane ke liye)
app.use('/uploads', express.static('uploads'));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Studio ka Database Connect ho gaya!'))
  .catch((err) => console.log('❌ Database Connection Failed:', err));

// 5. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 6. Multer Configuration (Photo ko temporarily memory mein rakhne ke liye)
const upload = multer({ storage: multer.memoryStorage() });

// --- DATABASE MODEL (Godown ka Structure) ---
const photoSchema = new mongoose.Schema({
    category: String,
    imagePath: String, // Yahan ab Cloudinary ka link aayega
    public_id: String, // Delete karne ke liye kaam aayega
    uploadDate: { type: Date, default: Date.now }
});
const Photo = mongoose.model('Photo', photoSchema);

// --- APIs (ROUTES) ---

// API 1: ADMIN LOGIN
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Apna secret admin id aur password (Akshar@123)
    if (username === 'Kiran' && password === 'Kiran@1980') {
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ error: 'Galat Username ya Password!' });
    }
});

// API 2: UPLOAD PHOTOS TO CLOUDINARY
app.post('/api/photos/upload', upload.array('photos', 50), async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Bina login upload nahi kar sakte!' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET); 

        const category = req.body.category;
        const uploadedPhotos = [];
        const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
})

        for (const file of req.files) {
            const b64 = Buffer.from(file.buffer).toString("base64");
            let dataURI = "data:" + file.mimetype + ";base64," + b64;
            
            const clRes = await cloudinary.uploader.upload(dataURI, {
                folder: `sarvam_studio/${category}` 
            });

            const newPhoto = new Photo({
                category: category,
                imagePath: clRes.secure_url,
                public_id: clRes.public_id
            });
            await newPhoto.save();
            uploadedPhotos.push(newPhoto);
        }

        res.json({ message: 'Photos successfully uploaded!', data: uploadedPhotos });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: 'Upload fail ho gaya. Backend logs check karo.' });
    }
});

// API 3: GET PHOTOS FOR WEBSITE
app.get('/api/photos/category/:category', async (req, res) => {
    try {
        const photos = await Photo.find({ category: req.params.category });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: 'Photos fetch nahi ho payi' });
    }
});

// API 4: DELETE PHOTO
app.delete('/api/photos/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized!' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);

        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ error: 'Photo nahi mili' });

        // Cloudinary se photo hamesha ke liye udana
        if (photo.public_id) {
            await cloudinary.uploader.destroy(photo.public_id);
        }
        
        // Database se record delete karna
        await Photo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Delete fail ho gaya' });
    }
});

// 7. Purani Reviews wali API (Agar iski alag file tumhare paas hai toh)
app.use('/api/reviews', require('./routes/reviews')); 

// 8. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server chal pada hai port ${PORT} par`);
});
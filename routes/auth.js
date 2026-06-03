const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// 1. TEMPORARY ROUTE: Apna pehla Admin account banane ke liye
// Ise hum ek baar chalayenge aur fir hata denge
router.post('/create-admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Password ko encrypt (hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.json({ message: 'Admin account successfully ban gaya!' });
    } catch (err) {
        res.status(500).json({ error: "Kuch gadbad hui" });
    }
});

// 2. ADMIN LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check karo ki username exist karta hai ya nahi
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: 'Galat Username ya Password' });

        // Password check karo
        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) return res.status(400).json({ error: 'Galat Username ya Password' });

        // Sab sahi hai toh Ticket (JWT Token) de do
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: "Login successful!" });
    }catch (err) {
        console.log("Asli Error:", err);
        res.status(500).json({ error: "Kuch gadbad hui", details: err.message });
    }
});

module.exports = router;
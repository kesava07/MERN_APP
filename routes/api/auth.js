const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const router = express.Router();

//@route    api/auth

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ msg: "Server error" })
    }
});

//@route   POST api/auth
//desc     authenticating user and getting token
//Access   Public

router.post("/", [
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password is required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: "Invalid credentials" }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: "Invalid credentials" }]
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                res.json({ token })
            }
        );

    } catch (err) {
        res.status(500).json({ msg: "Server error" })
    }
});



module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

//@route    api/profile/me
//desc      getting the current user profile
//access    private

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        );
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" })
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).send("Server error")
    }
});

//@route    api/profile
//desc      Creating and updating the profile
//access    private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', "Skills are required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body;

    //Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

    //Building social object

    profileFields.social = {};

    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            //update

            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )

            return res.status(201).json(profile)
        }

        //create

        profile = new Profile(profileFields);
        await profile.save();
        res.status(201).json(profile)


    } catch (err) {
        res.status(500).send("Server error");
    }
});


//@route    api/profile
//desc      getting the current user profile
//access    private

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).send("Server error")
    }
});

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: "There is no profile for this user" });

        res.status(200).json(profile)

    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: "Profile not found" });
        res.status(500).send("Server error");
    }
});


//@route    api/profile
//desc      deleting the user and profile and posts
//access    private

router.delete("/", auth, async (req, res) => {
    try {

        //Deleting the Posts

        //Deleting the Profile
        await Profile.findOneAndDelete({ user: req.user.id })

        //Deleting the User
        await User.findOneAndDelete({ _id: req.user.id })

        res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
        res.status(500).send("Server error")
    }
});

module.exports = router;
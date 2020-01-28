const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

//@route    POST api/posts
//desc      Creating a post
//access    private

router.post("/", [
    auth,
    [check("text", "Text is required").not().isEmpty()]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {

        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.status(201).json(post);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

//@route    GET api/posts
//desc      Getting all the posts a post
//access    private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).send("Server error");
    }
})

//@route    GET api/posts/:id
//desc      Getting a post by id
//access    private


router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        res.status(200).json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Post not found" });

        res.status(500).send("Server error");
    }
});


//@route    DELETE api/posts/:id
//desc      Deleting a post by id
//access    private


router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        //check the user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorised" })
        }
        await post.remove();
        res.json({ msg: "Post removed successfully" });

    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Post not found" });
        res.status(500).send("Server error");
    }
});

//@route    PUT api/posts/like/:id
//desc      Liking a post
//access    private

router.put('/like/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(post => post.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.status(201).json(post.likes);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: "Post not found" });
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route    PUT api/posts/unlike/:id
// @desc     Like a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0
        ) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Get remove index
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
        if (removeIndex === -1) return res.status(404).json({ msg: "Bad request" });

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            if (!post) return res.status(404).json({ msg: "Post does not exist" });

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
);



// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Deleting a comment
// @access   Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id.toString() === req.params.comment_id);

        if (!comment) return res.status(404).json({ msg: "Comment does not exist" })

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorised" })
        }

        const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);

    } catch (err) {
        res.status(500).send('Server Error');
    }
});



module.exports = router;
import express from 'express';
import userModel from './models/user.js';
import postModel from './models/post.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import upload from './config/multer.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile/upload', (req, res) => {
    res.render('profileUpload');
});


app.post('/upload', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        console.log("🔍 req.user:", req.user); // ✅ Debugging Line

        let user = await userModel.findById(req.user.userId);
        
        if (!user) {
            console.error("❌ User not found:", req.user.username); // ✅ Debugging Line
            return res.status(404).send("User not found");
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).send("Error uploading image");
    }
});


app.post('/register', async (req, res) => {
    try {
        let { username, name, age, email, password } = req.body;

        let existingUser = await userModel.findOne({ email });

        if (existingUser) {
            console.error("Registration failed: User already exists with email:", email);
            return res.status(400).send('User already exists');
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user
        const newUser = await userModel.create({
            username,
            name,
            age,
            email,
            password: hashedPassword
        });

        // ✅ Generate Token
        const token = jwt.sign({ userId: newUser._id }, 'secretkey', { expiresIn: '1h' });

        // ✅ Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Change to `true` in production
            sameSite: 'strict'
        });

        console.log("User registered successfully:", newUser.email);

        // ✅ Redirect to Profile Page
        return res.redirect('/profile');
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).send('Error creating user');
    }
});


// ✅ Render Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// ✅ Login Route (Fixed)
app.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            console.error("Login failed: Invalid email");
            return res.status(401).send('Invalid email or password');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(500).send('Server error');
            }

            if (!result) {
                console.error("Login failed: Invalid password");
                return res.status(401).send('Invalid email or password');
            }

            // ✅ Generate Token
            const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

            // ✅ Set Cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Change to `true` in production
                sameSite: 'strict'
            });

            console.log("User logged in successfully:", user.email);

            // ✅ Redirect to Profile Page
            return res.redirect('/profile');
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send('Server error');
    }
});


// ✅ Logout Route (Clears Token)
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
    console.log('logout successfully!');
});

// ✅ Middleware to Check Authentication
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('You must be logged in to access this page');

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(401).send('Session expired. Please login again.');

        req.user = user; // ✅ Store user data in `req`
        next();
    });
}

// ✅ Protected Route (Only for Logged-in Users)
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user.userId }).populate({
            path: "posts",  // Change from "post" to "posts"
            populate: { path: "user", select: "username" }, // Get username from user
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.render('profile', { user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/post', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user.userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let { content } = req.body;

        // ✅ Prevent empty posts
        if (!content || content.trim().length === 0) {
            console.error("Post creation failed: Empty content");
            return res.status(400).json({ error: "Post content cannot be empty" });
        }

        let post = await postModel.create({
            user: user._id,
            content
        });

        if (!user.posts) {
            user.posts = [];
        }

        user.posts.push(post._id);
        await user.save();

        console.log("Post created successfully:", post);
        res.redirect('/profile');
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    try {
        // ✅ Use `_id` instead of `id`
        let post = await postModel.findOne({ _id: req.params.id }).populate('user');

        // ✅ Check if post exists
        if (!post) {
            console.error("Post not found:", req.params.id);
            return res.status(404).json({ error: "Post not found" });
        }

        // ✅ Ensure `likes` array exists
        if (!post.likes) {
            post.likes = [];
        }

        // ✅ Handle like/unlike
        let index = post.likes.indexOf(req.user.userId);
        if (index === -1) {
            post.likes.push(req.user.userId); // Like the post
        } else {
            post.likes.splice(index, 1); // Unlike the post
        }

        await post.save();
        res.redirect('/profile');
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findOne({ _id: req.params.id }).populate('user');

        if (!post) {
            return res.status(404).send("Post not found");
        }

        let user = await userModel.findById(req.user.userId); // Get logged-in user

        res.render('edit', { post, user }); // ✅ Pass user to template
    } catch (error) {
        console.error("Error fetching post for edit:", error);
        res.status(500).send("Internal server error");
    }
});

app.post('/update/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect('/profile');
});

app.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }
        await userModel.updateOne({ _id: req.user.userId }, { $pull: { posts: req.params.id } });

        res.redirect('/profile');
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Internal server error");
    }
});


app.get('/posts', isLoggedIn, async (req, res) => {
    try {
        let posts = await postModel.find().populate('user', 'username profilePicture').exec();

        let currentUser = await userModel.findById(req.user.userId).select("username profilePicture");

        res.render('posts', { 
            posts, 
            currentUser, // ✅ Current logged-in user
            currentUserId: req.user.userId 
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/posts/:id/like', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        let userId = req.user.userId;

        // ✅ Check if user has already liked the post
        let index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId); // ✅ Add user's like
        } else {
            post.likes.splice(index, 1); // ✅ Remove user's like (Unlike)
        }

        await post.save();
        res.redirect('/posts'); // ✅ Page reload with updated likes count
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
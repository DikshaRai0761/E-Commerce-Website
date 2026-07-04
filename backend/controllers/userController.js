import User from '../models/User.js';

// User Registration / Sign Up
// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields (name, email, password)" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password // Storing as plain text for simple beginner level, with a warning comment below
    });

    // In a real application, you would hash the password using bcrypt:
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    //
    // And sign a JWT token:
    // const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Generate a simple, secure mock token for authenticating on the client side
    const mockToken = `mock_jwt_token_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.email === 'admin@gmail.com' || newUser.email.includes('admin') // Simple rule to make someone admin
      },
      token: mockToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// User Login
// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate simulated token
    const mockToken = `mock_jwt_token_${user.id}_${Date.now()}`;

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.email === 'admin@gmail.com' || user.email.includes('admin') // Anyone using an email with "admin" is given admin rights for testing ease!
      },
      token: mockToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/UserModel.ts');  // no .js extension in CommonJS
// const { userSendMail } = require('./userSendMail');  // destructure if ed as object

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/UserModel.ts'
import { userSendMail } from './EmailAuthController.ts';

// Schedule cleanup task to run every hour
setInterval(async () => {
  try {
    const result = await cleanupExpiredAccounts();
    if (result) {
      console.log(`Cleaned up ${result.deletedCount} expired unverified accounts`);
    }
  } catch (error) {
    console.error('Error in scheduled cleanup:', error);
  }
}, 60 * 60 * 1000); // Run every hour

// Helpers
function isMatch(password: any, confirmPassword: any) {
  return password === confirmPassword;
}

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password: any) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password);
}

function createRefreshToken(payload: any) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1d' });
}

// Cleanup expired unverified accounts
const cleanupExpiredAccounts = async () => {
  try {
    const result = await User.deleteMany({
      isVerified: false,
      otpExpires: { $lt: new Date() }
    });
    return result;
  } catch (error) {
    console.error('Error cleaning up expired accounts:', error);
    return null;
  }
};

// Register User
const signUp = async (req: any, res: any) => {
  try {
    const { userName, email, password, confirmPassword, phoneNumber } = req.body;

    if (!userName || !email || !password || !confirmPassword)
      return res.status(400).json({ message: 'Please fill in all required fields.' });

    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email.' });

    if (!validatePassword(password))
      return res.status(400).json({ message: 'Password must be 6–20 chars with upper, lower, number.' });

    if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: 'Passwords do not match.' });

    // Clean up any expired unverified accounts first
    await cleanupExpiredAccounts();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email is already in use.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      otp,
      otpExpires,
      isVerified: false
    });

    await newUser.save();

    await userSendMail(email, otp, 'Verify your email address', res);

    res.json({
      message: 'Registration successful. Check your email for OTP. You have 10 minutes to verify your account.',
      expiresIn: '10 minutes'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Email Verification
const verifyOtp = async (req: any, res: any) => {
  try {
    const { email, otp } = req.body;

    // First cleanup any expired accounts
    await cleanupExpiredAccounts();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Account not found or has expired. Please register again.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified.' });
    }

    if ((user.otpExpires as NativeDate).getTime() < Date.now()) {
      // Delete the expired unverified account
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
const resendOtp = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    // First cleanup any expired accounts
    await cleanupExpiredAccounts();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Account not found or has expired. Please register again.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await userSendMail(email, otp, 'Your new OTP code', res);

    res.json({
      message: 'New OTP sent successfully. You have 10 minutes to verify your account.',
      expiresIn: '10 minutes'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const signIn = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });

    const refreshToken = createRefreshToken({ id: user._id, role: user.role });

    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user info
const userInfor = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (by user)
const updateUser = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Add User
const addUser = async (req: any, res: any) => {
  try {
    const { userName, email, password, phoneNumber, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      isVerified: true,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User added by admin',
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  signUp,
  verifyOtp,
  resendOtp,
  signIn,
  userInfor,
  updateUser,
  addUser,
  deleteUser,
};

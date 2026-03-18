// const express = require('express');
// const userController = require('../controllers/UserController');

import express from 'express'
import { signUp, signIn, verifyOtp, resendOtp, addUser, updateUser, deleteUser } from '../controllers/UserController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/add', addUser);
router.put('/edit/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router

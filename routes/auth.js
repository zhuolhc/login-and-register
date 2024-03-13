// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 注册路由
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 检查用户名是否已存在
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).send('用户名已存在');
  }

  // 加密密码
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 创建新用户
  const newUser = new User({
    username,
    password: hashedPassword
  });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器错误');
  }
});

// 登录路由
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('用户名或密码错误');
  }

  // 验证密码
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).send('用户名或密码错误');
  }

  // 登录成功
  req.session.user = user;
  res.redirect('/dashboard');
});

// 仪表板路由
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.session.user });
});

// 退出路由
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;

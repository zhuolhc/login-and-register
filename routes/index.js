// routes/index.js
const express = require('express');
const router = express.Router();

// 主页路由
router.get('/', (req, res) => {
  res.send('欢迎访问我们的网站!');
});

module.exports = router;

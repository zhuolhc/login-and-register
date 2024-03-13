// app.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost/my-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败', err));

// 中间件
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 设置视图引擎
app.set('view engine', 'ejs');

// 路由
app.use('/', indexRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`服务器正在运行于 http://localhost:${PORT}`);
});

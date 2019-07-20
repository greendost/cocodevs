import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from './server/api-router';

var app = express();
const PORT = process.env.PORT || 3001;

app.set('views', './views');
app.set('view engine', 'pug');

// middleware
app.use((req, res, next) => {
  console.log(`req.url=${req.url}`);
  next();
});
app.use(express.static('./dist/public'));
app.use(bodyParser.json());
app.use('/api', apiRouter);

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});

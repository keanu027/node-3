const express = require('express');
const massive = require('massive');
const users = require('../controllers/user.js');
const jwt = require('jsonwebtoken');
const secret = require('../secret.js');

massive({
  host: 'localhost',
  port: 5432,
  database: 'node3',
  user: 'postgres',
  password: 'node3db',
}).then(db => {
  const app = express();

  app.set('db', db);

  app.use(express.json());

  app.post('/api/users', users.create);
  app.post('/api/login', users.login);

  app.get('/api/users', users.list);
  app.get('/api/users/:id', users.getById);
  app.get('/api/users/:id/profile', users.getProfile);

  app.post('/api/posts',users.posts)
  app.patch('/api/posts/:id', users.updatePostsId);
  app.get('/api/posts/:id', users.commentList);
  app.get('/api/posts',users.postLists);

  app.post('/api/comments',users.comments)
  app.patch('/api/comments/:id',users.updateComments)

  app.get('/api/protected/data',function(req, res){
    if (!req.headers.authorization) {
        return res.status(401).end();
      }
     
      try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret); 
        res.status(200).json({ data: 'here is the protected data' });
      } catch (err) {
        console.error(err);
        res.status(401).end();
      }
})

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
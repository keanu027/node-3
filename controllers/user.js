const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../secret.js');


function create(req, res) {
    const db = req.app.get('db');
  
    const { email, password } = req.body;
    argon2
    .hash(password)
    .then(hash => {
        return db.users.insert(
          {
            email,password: hash,
            user_profiles: [
                {
                userId: undefined, about: null, thumbnail: null,
                },
             ],
          },
          {
              deepInsert: true,
          },
          {
            fields: ['id', 'email'], 
          }
        );
      })
      .then(user => {
        const token = jwt.sign({ userId: user.id }, secret); 
        res.status(201).json({ ...user, token });
      })
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
    /*
    db.users
       .insert({
           email,password,
           user_profiles: [
               {
               userId: undefined, about: null, thumbnail: null,
               },
            ],
       },
       {
           deepInsert: true,
       }
       )
       .then(user => res.status(201).json(user)) 
       .catch(err => {
        console.error(err); 
      });
 */
  }

  function login(req, res) {
    const db = req.app.get('db');
    const { email, password } = req.body;
  
    db.users
      .findOne(
        {
          email,
        },
        {
          fields: ['id', 'email', 'password'],
        }
      )
      .then(user => {
        if (!user) {
          throw new Error('Invalid email');
        }

        return argon2.verify(user.password, password).then(valid => {
          if (!valid) {
            throw new Error('Incorrect password');
          }
  
          const token = jwt.sign({ userId: user.id }, secret);
          delete user.password; 
          res.status(200).json({ ...user, token });
        });
      })
      .catch(err => {
        if (
          ['Invalid email', 'Incorrect password'].includes(err.message)
        ) {
          res.status(400).json({ error: err.message });
        } else {
          console.error(err);
          res.status(500).end();
        }
      });
  }

function list(req, res){
    const db = req.app.get('db');

  db.users
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getById(req, res) {
    const db = req.app.get('db');
  
    db.users
      .findOne(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function getProfile(req, res) {
    const db = req.app.get('db');
  
    db.user_profiles
      .findOne({
        userId: req.params.id,
      })
      .then(profile => res.status(200).json(profile))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function posts(req, res) {

    const db = req.app.get('db');
    const {  userId,content } = req.body;
    db.posts
       .save({ userId,content })
       .then(post => res.status(201).json(post)) 
       .catch(err => {
        console.error(err); 
      });

  }

  function updatePostsId(req, res) {
    const db = req.app.get('db');
    const { content } = req.body;
    db.posts
        .update(
            {
               id: req.params.id 
            },
            {
                content: content 
            })
       .then(post => res.status(201).json(post)) 
       .catch(err => {
        console.error(err); 
      });
    
  }

  function comments(req, res) {

    const db = req.app.get('db');
    const {  userId,postId,comment } = req.body;

    db.comments
      .save({  userId,postId,comment } )
      .then(comments => res.status(201).json(comments))
      .catch(err =>{
        console.error(err);
      })
  }

  function commentList(req, res){
    const db = req.app.get('db');
    
    db.posts  
    .find(req.params.id)
    .then(post => {
        db.comments
      .find({postId:req.params.id})
      .then(comment => res.status(200).json({post,comment}))
      .catch(err => {
          console.error(err)
          res.status(500).end()
      })
    })
    .catch(err => {
        console.log(err)
        res.status(500).end()
    })
  }

  function postLists(req, res){
    const db = req.app.get('db');

  db.posts
    .find()
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function updateComments(req, res) {
    const db = req.app.get('db');
    const { comment } = req.body;
    db.comments
        .update(
            {
               id: req.params.id 
            },
            {
                comment: comment 
            })
       .then(comment => res.status(201).json(comment)) 
       .catch(err => {
        console.error(err); 
      });
    
  }

  module.exports = {
    create, login,

    list , getById, getProfile,

    posts, updatePostsId, commentList, postLists,

    comments, updateComments
  };
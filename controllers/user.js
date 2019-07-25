function create(req, res) {
    const db = req.app.get('db');
  
    const { email, password } = req.body;
    
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
       .save({ userId,postId,comment })
       .then(comments => res.status(201).json(comments)) 
       .catch(err => {
        console.error(err); 
      });

  }

  function commentList(req, res){
    const db = req.app.get('db');
    
    db.posts
    .find(req.params.userId)
    .then(post => {
        db.comments
      .find(req.params.postId)
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
    create, 
    list ,
    getById,
    getProfile,
    posts,
    updatePostsId,
    commentList,
    postLists,
    comments,
    updateComments
  };
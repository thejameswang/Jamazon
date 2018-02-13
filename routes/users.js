import express from 'express';
var router = express.Router();
import models from '../models.js';
var User = models.User;
var Product = models.Product;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get( '/signup/', (req, res) => {
  res.render( 'signup', { title: 'Sign Up' } );
});

router.post( '/signup/', (req, res) => {
  if( !req.body.username ) { res.render( 'signup', { error: "Username required" } ); return; }
  if( !req.body.password ) { res.render( 'signup', { error: "Password required" } ); return; }
  if( req.body.password !== req.body.password2 ) { res.render( 'signup', { error: "Passwords don't match" } ); return; }
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser.save( (saveErr, savedUser) => {
    res.redirect( '/users/login/' );
  });
});

router.get( '/login/', (req, res) => {
  res.render( 'login', { title: 'Log In' } );
});

router.post( '/login/', (req, res) => {
  if( !req.body.username ) { res.render( 'login', { error: "Username required" } ); return; }
  if( !req.body.password ) { res.render( 'login', { error: "Password required" } ); return; }
  User.findOne( { username: req.body.username, password: req.body.password }, (findErr, foundUser) => {
    if( findErr ) { console.log( 'Error logging in\n' + findErr ); res.status(400).render( 'login', { error: findErr } ); return; }
    if( !foundUser ) { console.log( 'Incorrect credentials\n' ); res.status(400).render( 'login', { error: 'Inccorect credentials' } ); return; }
    res.redirect( '/' );
  });
});

router.get( '/logout/', (req,res) => {
  req.logout();
  req.session.cart = [];
  res.redirect( '/users/login/' );
});

export default router;

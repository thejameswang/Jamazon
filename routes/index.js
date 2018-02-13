import express from 'express';
var router = express.Router();
import models from '../models.js';
var User = models.User;
var Product = models.Product;
var Customer = models.Customer;

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
/* GET home page. */
router.get( '/', function( req, res, next ) {
  Product.find( {}, (findErr, foundProducts) => {
    if( findErr ) { console.log( 'Error fetching Products\n' + findErr ); res.status(500).send( findErr ); return; }
    res.render('index', {
      title: 'Products',
      products: foundProducts,
    });
  });
});

router.get( '/product/:pid', (req, res, next) => {
  Product.findById( req.params.pid, (findErr, foundProduct) => {
    if( findErr ) { console.log( 'Error finding single Product\n' + findErr ); res.status(500).send( findErr ); return; }
    if( !foundProduct ) { console.log( 'Invalid Product Id' ); res.status(400).render( 'index' ); return; }
    res.render( 'product', {
      title: foundProduct.title,
      product: foundProduct
    });
  });
});

router.post( '/product/:pid', (req, res, next) => {
  if( !req.session.cart ) { req.session.cart = []; }
  req.session.cart.push( req.params.pid );
  res.redirect( '/product/' + req.params.pid );
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  let promiseArr = [];
  if( !req.session.cart ) { req.session.cart = []; }
  for( let i = 0; i < req.session.cart.length; i++ ) {
    promiseArr.push( Product.findById( req.session.cart[i] ) );
  }
  Promise.all( promiseArr )
  .then( (response) => {
    res.render( 'cart', { title: 'Your Cart', products: response } );
  });
});

// router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  // res.send( 'in progress' );
// });

router.get('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  if( !req.session.cart ) { req.session.cart = []; }
  for( let i = 0; i < req.session.cart.length; i++ ) {
    if( req.session.cart[i].toString() === req.params.pid.toString() ) {
      req.session.cart.splice( i, 1 );
      break;
    }
  }
  res.redirect( '/cart/' );
});

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect( '/' );
});

router.post('/checkout', (req, res, next) => {
  var token = req.body.stripeToken;
  stripe.customers.create({
    email: "paying.user@example.com",
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    // Use and save the charge info.
    res.send( 'in progress' );
  });
});

export default router;

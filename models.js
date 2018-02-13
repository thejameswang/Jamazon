import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String
});

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  stripeCustomerEmail: String,
  stripeCVC: String,
  _userid: mongoose.Schema.Types.ObjectId
});

var User = mongoose.model( 'User', userSchema );
var Product = mongoose.model( 'Product', productSchema );
var Payment = mongoose.model( 'Payment', paymentSchema );

var models = {
  User: User,
  Product: Product,
  Payment: Payment
}
export default models;

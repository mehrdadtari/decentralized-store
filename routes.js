const routes = require("next-routes")();
//the parantesis at the end shows that this module returns a function instead of a class. and this function is immediately invoked.

routes
  .add("/stores/new", "stores/new")
  .add("/stores/:address", "/stores/show")
  .add("/stores/:address/products", "stores/products/index")
  .add("/stores/:address/products/new", "/stores/products/new")
  .add("/stores/:address/products/review", "/stores/products/review");

//The order of add mehtods are important!
module.exports = routes;
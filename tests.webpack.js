// Make sure you have your directory and regex test set correctly!
// Thanks to http://qiita.com/kimagure/items/f2d8d53504e922fe3c5c
const context = require.context('./tests', true, /\.js$/);

context.keys().forEach(context);

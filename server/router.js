const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/user', mid.requiresLogin, controllers.Account.getUser);
  app.post('/user', mid.requiresLogin, controllers.Account.updateUser);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.post('/updatePassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.updatePassword)

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
  app.get('/game', mid.requiresLogin, controllers.Account.gamePage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

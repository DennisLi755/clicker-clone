const mongoose = require('mongoose');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  console.log('in logout function');
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/game' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/game' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username is already in use!' });
    }
    return res.status(500).json({ error: 'An error has occured!' });
  }
};

const gamePage = async (req, res) => res.render('app');

const getUser = async(req, res) => {
  try {
    const query = { _id: new mongoose.Types.ObjectId(req.session.account._id) };
    const docs = await Account.find(query).select('username score powerUps premium').lean().exec();
    console.log(docs[0]);

    return res.json({ user: docs[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user!' });
  }
};

const updateUser = async(req, res) => {
  try {
    console.log(req.body);
    await Account.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.session.account._id) },
      { $set: { powerUps: req.body.powerUps, score: req.body.score, premium: req.body.premium } },
      { new: true },
    ).exec();
  } catch (err) {
    console.log(err);
  }
  return res.status(500).json({ error: 'An error has occurred. ' });
}

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  gamePage,
  getUser,
  updateUser
};

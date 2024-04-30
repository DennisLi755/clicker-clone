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
//Function for updating a password
const updatePassword = async (req, res) => {
  try {
    //inputted password is hashed
    const hash = await Account.generateHash(req.body.pass);
    //Update the users new password with the hashed data
    await Account.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.session.account._id) },
      { $set: { password: hash } },
      { new: true },
    ).exec();
    return res.json({ redirect: '/game' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occurred. ' });
  }
};

const gamePage = async (req, res) => res.render('app');

//Gets a single user from the id
const getUser = async (req, res) => {
  try {
    const query = { _id: new mongoose.Types.ObjectId(req.session.account._id) };
    const docs = await Account.find(query).select('username score powerUps premium').lean().exec();

    return res.json({ user: docs[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user!' });
  }
};

//Updates a user from the id
const updateUser = async (req, res) => {
  try {
    console.log(`body:${req.body.score}`);
    await Account.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.session.account._id) },
      { $set: { powerUps: req.body.powerUps, score: req.body.score, premium: req.body.premium } },
      { new: true },
    ).exec();
    return res.status(201).json({ message: 'User updated' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occurred. ' });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const docs = await Account.find().select('username score').lean().exec();
    console.log(docs);

    return res.json({ user: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  gamePage,
  getUser,
  updateUser,
  updatePassword,
  getAllUsers,
};

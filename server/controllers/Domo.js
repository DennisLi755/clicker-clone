const models = require('../models');
ObjectId = require('mongodb').ObjectId;

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoriteFood: req.body.favoriteFood ? req.body.favoriteFood : 'Nikujaga',
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      favoriteFood: newDomo.favoriteFood,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(500).json({ error: 'An error has occurred making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age favoriteFood').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    console.log(new ObjectId(req.params.id));
    const query = {owner: req.session.account._id, _id: new ObjectId(req.params.id)};
    const docs = await Domo.deleteOne(query);
    //console.log(docs);
    return res.status(204);
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: 'Error deleting domo'});
  }
}

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};

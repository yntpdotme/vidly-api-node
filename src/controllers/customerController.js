import {Customer, validate} from '../models/Customer.js';

const getAllCustomers = async (req, res) => {
  const customers = await Customer.find({}, {__v: 0}).sort({name: 1});

  res.send(customers);
};

const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id).select('-__v');
  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.json(customer);
};

const createCustomer = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  await customer.save();

  res.status(201).json(customer);
};

const updateCustomerById = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    {new: true},
  ).select('-__v');

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.json(customer);
};

const deleteCustomerById = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id).select(
    '-__v',
  );

  if (!customer)
    return res.status(404).send('The customer with the given ID was not found');

  res.json(customer);
};

export {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
};

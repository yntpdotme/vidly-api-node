import {Genre, validate} from '../models/Genre.js';

const getAllGenres = async (req, res) => {
  const genres = await Genre.find({}, {__v: 0}).sort({name: 1});

  res.json(genres);
};

const getGenreById = async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  res.json(genre);
};

const createGenre = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();

  res.status(201).json(genre);
};

const updateGenreById = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {name: req.body.name},
    {new: true},
  );
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  res.json(genre);
};

const deleteGenreById = async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  res.json(genre);
};

export {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenreById,
  deleteGenreById,
};

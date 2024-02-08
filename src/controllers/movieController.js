import {Genre} from '../models/Genre.js';
import {Movie, validate} from '../models/Movie.js';

const getAllMovies = async (req, res) => {
  const movies = await Movie.find({}, {__v: 0}).sort({title: 1});
  res.json(movies);
};

const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');
  res.json(movie);
};

const createMovie = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();

  res.status(201).json(movie);
};

const updateMovieById = async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.issues[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {new: true},
  );
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');

  res.json(movie);
};

const deleteMovieById = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found');

  res.json(movie);
};

export {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
};

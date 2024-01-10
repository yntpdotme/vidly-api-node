import mongoose from "mongoose";
import zod from "zod";

// Define Schema
const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 50,
		required: true,
	},
});

// Creating Model
const Genre = mongoose.model("Genre", genreSchema);

// Validation Logic
const validateGenre = (genre) => {
	const schema = zod.object({
    name: zod
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Must be 3 or more characters long" })
      .max(50, { message: "Must be 50 or fewer characters long" }),
  }).strict();

	return schema.safeParse(genre);
};

export { Genre, validateGenre as validate };

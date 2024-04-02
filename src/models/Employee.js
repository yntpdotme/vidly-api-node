import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import zod from 'zod';

// Define Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  refreshToken: {
    type: String,
  },
});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY},
  );

  return accessToken;
};

employeeSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY},
  );

  return refreshToken;
};

// Create Model
const Employee = mongoose.model('Employee', employeeSchema);

// Validation Logic
const employeeRegisterValidator = employee => {
  const schema = zod
    .object({
      name: zod
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        })
        .trim()
        .min(3, {message: 'Must be 3 or more characters long'})
        .max(255, {message: 'Must be 255 or fewer characters long'}),

      email: zod
        .string({
          required_error: 'Email is required',
        })
        .email('Please enter a valid email address'),

      password: zod
        .string({required_error: 'Password is required'})
        .min(
          6,
          'Password must have at least 6 characters, one uppercase letter, one lowercase letter, one digit, and one special character.',
        )
        .refine(password => {
          // At least one uppercase letter, one lowercase letter, one digit, and one special character
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
          return passwordRegex.test(password);
        }, 'Password must have at least 6 characters, one uppercase letter, one lowercase letter, one digit, and one special character.'),
    })
    .strict();

  return schema.safeParse(employee);
};

const employeeLoginValidator = employee => {
  const schema = zod
    .object({
      email: zod
        .string({required_error: 'Email is required'})
        .email('Please enter a valid email address'),
      password: zod
        .string({required_error: 'Password is required'})
        .min(1, 'Password is required'),
    })
    .strict();

  return schema.safeParse(employee);
};

export {
  Employee,
  employeeRegisterValidator as ValidateRegister,
  employeeLoginValidator as ValidateLogin,
};

import mongoose from 'mongoose';
import zod from 'zod';
import parsePhoneNumber from 'libphonenumber-js';

// Define Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Creating Model
const Customer = mongoose.model('Customer', customerSchema);

// Validation Logic
const validateCustomer = customer => {
  const isValidPhoneNumber = value => {
    try {
      const phoneNumber = parsePhoneNumber(value, 'International');
      return phoneNumber && phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  };

  const schema = zod.object({
    name: zod
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2),
    isGold: zod.boolean().optional(),
    phone: zod
      .string({
        required_error: 'Phone Number is required',
        invalid_type_error: 'Phone Number must be a string',
      })
      .refine(phone => isValidPhoneNumber(phone), {
        message: 'Invalid phone number',
      }),
  });

  return schema.safeParse(customer);
};

export {Customer, validateCustomer as validate};

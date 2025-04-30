import Joi from "joi"



const movieSchemaValidator = Joi.object({
    title: Joi.string()
      .required()
      .messages({
        'string.base': 'Title must be a string',
        'any.required': 'Title is required'
      }),
    
    description: Joi.string()
      .required()
      .messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required'
      }),
    
    duration: Joi.number()
      .required()
      .messages({
        'number.base': 'Duration must be a number',
        'any.required': 'Duration is required'
      }),
    
    rating: Joi.number()
      .min(0)
      .max(10)
      .optional()
      .messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 0',
        'number.max': 'Rating must be at most 10'
      }),
    
    releaseDate: Joi.date()
      .required()
      .messages({
        'date.base': 'Release date must be a valid date',
        'any.required': 'Release date is required'
      }),
    
    language: Joi.string()
      .required()
      .messages({
        'string.base': 'Language must be a string',
        'any.required': 'Language is required'
      }),
    
    genre: Joi.array()
      .items(Joi.string())
      .required()
      .messages({
        'array.base': 'Genre must be an array of strings',
        'any.required': 'Genre is required'
      }),
  });
  
  // Example usage

  
  export { movieSchemaValidator };
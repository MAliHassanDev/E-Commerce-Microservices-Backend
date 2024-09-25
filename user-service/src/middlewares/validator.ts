import { Request,Response,NextFunction } from "express";
import logger from "../config/logger.ts";


interface ValidationError{
  field: string,
  message: string,
}

const isNameValid = (name: string): boolean => /^[a-zA-Z0-9]+(?:[ \-'][a-zA-Z0-9]{1,})*$/.test(name);

const isEmailValid = (email: string): boolean => /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const isPasswordStrong = (password: string): boolean => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}/.test(password);



console.log(isEmailValid("Homail@gmail.com"))

const validateName = (name: string): string|null => {
  if (!name) return 'Name is required';
  if (!isNameValid(name)) return 'Name is Invalid'; 
  return null;
}

const validateEmail = (email: string): string|null => {
  if (!email) return 'Email is required';
  if (!isEmailValid(email)) return'Email is Invalid. Only letters (a-z), numbers (0-9), periods(.) are allowed';
  return null;
}

const validatePassword = (password: string): string|null => {
  if (!password) return `Password is required`;
  if(!isPasswordStrong(password)) return 'Password is weak. Try a mix of letters, numbers, and symbols.'
  return null;
}

const addError = (errors: any[], field: string, message: string) => {
  errors.push({
    field,
    message
  })
}

export const validateRegistrationData = (req: Request, res: Response, next: NextFunction) => {
  const errors: Array<ValidationError> = [];
  
  const fieldValidationMap = {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
  };

  
  for (const [field,validateField] of Object.entries(fieldValidationMap)) {
    const errorMessage = validateField(req.body[field]);
    if (errorMessage) addError(errors, field,errorMessage,);
  }

  if (errors.length === 0) return next();

  res.status(400).json({
    success: false,
    message: "Invalid registration data",
    errors,
    data: null,
  })
}

export const validateSignInData = (req: Request, res: Response, next: NextFunction) => {
  const errors: Array<ValidationError> = [];
  
  const fieldValidationMap = {
    email: validateEmail,
    // password: validatePassword,
  }

  for (const [field, validateField] of Object.entries(fieldValidationMap)) {
    const errorMessage = validateField(req.body[field]);
    if (errorMessage) addError(errors, field, errorMessage);
  }

  if (errors.length === 0) return next();

  res.status(400).json({
    success: false,
    message: "Invalid signin request data.",
    errors,
    data: null,
  })
}
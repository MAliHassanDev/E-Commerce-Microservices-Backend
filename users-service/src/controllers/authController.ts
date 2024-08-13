import { NextFunction, Request, Response } from "express";
import User from "../database/models/userModel.ts";
import bcrypt from 'bcrypt';
import config from "../config/config.ts";
import jwt from 'jsonwebtoken';

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      })
    }
    // create password hash
    const {saltRounds} = config.getBcryptConfig()
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password:hashPassword });
    await newUser.save();
    const {secret,expiresIn} = config.getJwtConfig();
    const token = await generateJasonToken({ id: newUser._id, }, secret, expiresIn);
    res.status(201).json({
      sucess: true,
      message: "User registered successfully",
      token,
      data: {
        name: newUser.name,
        email: newUser.email,
        password: null,
      }
    })
  } catch (error) {
    next(error);
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      })
    };

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    // generate new token for user
    const {secret,expiresIn} = config.getJwtConfig();
    const token = await generateJasonToken({ id: user._id, }, secret, expiresIn);

    res.status(200).json({
      success: true,
      message: "User login successfull.",
      token,
      data: {
        name: user.name,
        email: user.email,
        password: null,
      },
    })
    
  } catch (error) {
    next(error)
  }
}


export const signOutUser = (req: Request, res: Response, next: NextFunction) => {
  
}


const generateJasonToken = (payload: object, secret: string,expiresIn: number):Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret,{expiresIn}, (err, token) => {
      if (err) reject(err);
      resolve(token);
    })    
  })
}

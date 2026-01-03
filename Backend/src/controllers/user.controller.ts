import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}


const registerUser = async (req: Request, res: Response) => {
  try {
    
    const { username, email, password } = req.body as RegisterBody;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
      userData: payload,
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      userData: payload,
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default { registerUser, loginUser };

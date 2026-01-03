
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface Payload{
    userId:string,
    email:string
}

export const generateToken = (payload:Payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};

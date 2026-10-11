import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const signAccessToken = ({ userId, role }) => {
  return jwt.sign({ role }, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

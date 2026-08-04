import bcrypt from "bcrypt";
import { BCRYPT } from "./security.constants.js";

export const hash = (
  payload,
  costFactor = BCRYPT.DEFAULT_COST_FACTOR
) => {
  return bcrypt.hash(payload, costFactor);
};

export const verify = (payload, hash) => {
  return bcrypt.compare(payload, hash);
};

export const basicPayload = (text) => text;

export const saltPayload = (text, salt) =>
  `${text}${salt}`;

export const saltPepperPayload = (text, salt) => {
  const pepper = process.env.HASH_PEPPER;

  if (!pepper) {
    throw new Error("HASH_PEPPER is not configured on the server.");
  }

  return `${text}${salt}${pepper}`;
};

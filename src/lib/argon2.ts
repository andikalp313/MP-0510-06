import { verify, hash } from "argon2";

export const hashPassword = async (password: string) => {
  return await hash(password);
};

export const comparePaswword = async (
  candidatePassword: string,
  hashedPassword: string
) => {
  return await verify(hashedPassword, candidatePassword);
};

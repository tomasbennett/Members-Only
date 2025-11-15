import { z } from "zod";


export const usernamepasswordSchema = z
  .string()
  .min(1, { message: "Username and password must both have a length greater than 1!!!" })
  .max(30, { message: "Username and password must both have a length less than 30!!!" })
  .regex(/^[A-Za-z0-9]+$/, { message: "Only letters and numbers allowed!!!" });


export type IUsernamePassword = z.infer<typeof usernamepasswordSchema>;
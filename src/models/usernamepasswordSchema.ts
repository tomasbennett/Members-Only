import { z } from "zod";


export const usernamepasswordSchema = z
  .string()
  .min(1, { message: "Input fields must have a length greater than 1!!!" })
  .max(40, { message: "Input fields must have a length less than 40!!!" })
  .regex(/^[A-Za-z0-9 !?.]+$/, {
    message: "Only letters, numbers, spaces, and basic punctuation (! ? .) allowed!!!"
  });
  
export type IUsernamePassword = z.infer<typeof usernamepasswordSchema>;
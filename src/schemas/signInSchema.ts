import { z } from "zod";

export const signInSchema = z.object({
    identifier : z.string(),  // identifier is nothing but username or email
    password : z.string(),
});

import z from "./zod";
export const workspaceUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  image: z.string().nullish(),
  role: z.string(),
  isMachine: z.boolean().default(false),
  createdAt: z.date(),
});


export type WorkspaceUserProps = z.infer<typeof workspaceUserSchema>;
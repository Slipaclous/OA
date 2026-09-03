import { z } from "zod";

export const rsvpSchema = z.object({
  fullName: z
    .string()
    .min(2, "Veuillez renseigner votre nom complet (au moins 2 caractères)"),
  email: z
    .string()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),
  status: z.enum(["YES", "NO"], {
    error: "Veuillez indiquer votre présence",
  }),
  guestsCount: z
    .number()
    .int()
    .min(1, "Au moins 1 convive")
    .max(10, "Maximum 10 convives"),
  events: z.array(z.string()).default(["ceremony", "cocktail", "dinner"]),
  dietaryRestrictions: z.string().max(500).optional(),
  songSuggestion: z.string().max(200).optional(),
  loveNote: z.string().max(1000).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

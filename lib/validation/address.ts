import { z } from "zod";

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
] as const;

/** Shared by the checkout form (client UX) and, later, the save-address server action. */
export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)[789][01]\d[\s-]?\d{3}[\s-]?\d{4}$/, "Enter a valid Nigerian phone number, e.g. 0803 123 4567"),
  line1: z.string().trim().min(4, "Enter a street address").max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2, "Enter a city").max(60),
  state: z.enum(NIGERIAN_STATES, { error: "Choose a state" }),
});

export type AddressInput = z.infer<typeof addressSchema>;

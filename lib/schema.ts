import { z } from "zod";

export const tripSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().min(4, "Title must be more than 4 characters").max(100, "Title must be less than 100 characters"),
    start_date: z.coerce.date({
      errorMap: () => ({ message: "Start Date must be a valid date format" }),
    }),
    end_date: z.coerce.date({
      errorMap: () => ({ message: "End Date must be a valid date format" }),
    }),
    description: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      return data.start_date < data.end_date;
    },
    {
      message: "The End Date must be after the Start Date",
      path: ["end_date"],
    }
  );

export type Trip = z.infer<typeof tripSchema>;

type TripFormSuccess = { success: true; data: Trip };
type TripFormFailure = {
  success: false;
  errors: Partial<Record<keyof Trip, string[]>>;
};

export function validateTripForm(data: Partial<Trip>): TripFormSuccess | TripFormFailure {
  const result = tripSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }
}

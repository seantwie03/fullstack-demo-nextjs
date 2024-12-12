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
    last_updated_at: z.coerce
      .date({
        errorMap: () => ({ message: "Last Updated Date must be a valid date format" }),
      })
      .optional()
      .default(new Date()),
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
// export const tripSchema = tripSchemaBase

// export const tripFormSchema = tripSchemaBase.omit({ id: true, last_updated_at: true }).refine(
//   (data) => {
//     return data.start_date < data.end_date;
//   },
//   {
//     message: "The End Date must be after the Start Date",
//     path: ["end_date"],
//   }
// );

export type Trip = z.infer<typeof tripSchema>;
// export type TripFormData = z.infer<typeof tripFormSchema>;

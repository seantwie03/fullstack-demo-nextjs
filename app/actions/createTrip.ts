"use server";

import sql from "lib/db";
import { tripSchema } from "lib/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createTrip(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const result = tripSchema.safeParse({
    ...rawFormData,
    last_updated_at: new Date(),
    description: rawFormData.description || null,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed",
    };
  }

  await sql`
    INSERT INTO trips
      (title, start_date, end_date, description)
    values
      (${result.data.title}, ${result.data.start_date}, ${result.data.end_date}, ${result.data.description || ""}) 
  `;
  console.log("Trip created:", result.data);

  return {
    message: "Trip created successfully!",
    trip: result.data,
  };
}

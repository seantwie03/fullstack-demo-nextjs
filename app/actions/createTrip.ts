"use server";

import sql from "@/lib/db";
import { validateTripForm } from "lib/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createTrip(prevState: any, formData: FormData) {
  console.log("createTrip called");
  const rawFormData = Object.fromEntries(formData.entries());
  const result = validateTripForm(rawFormData);

  if (!result.success) {
    console.log("Trip Validation failed", result.errors);
    return {
      errors: result.errors,
      message: "Validation failed",
    };
  }

  // Here you would typically save the trip to your database
  console.log("Trip created:", result.data);
  await sql`
    INSERT INTO trips
      (title, start_date, end_date, description)
    VALUES
      (${result.data.title}, ${result.data.start_date}, ${result.data.end_date}, ${result.data.description || null})
  `;

  return {
    message: "Trip created successfully!",
    trip: result.data,
  };
}

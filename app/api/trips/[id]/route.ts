import sql from "lib/db";
import { validateTripForm } from "lib/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = (await params).id;
  const body = await request.json();

  const validationResult = validateTripForm(body);

  if (!validationResult.success) {
    return NextResponse.json({ errors: validationResult.errors }, { status: 400 });
  }

  try {
    const { title, start_date, end_date, description } = validationResult.data;

    await sql`
      UPDATE trips 
      SET title = ${title}, 
          start_date = ${start_date}, 
          end_date = ${end_date}, 
          description = ${description || null}
      WHERE id = ${Number(id)}
    `;

    revalidatePath("/"); // in an API route this only affects future requests

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}

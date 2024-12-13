import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import sql from "lib/db";
import { Trip } from "lib/schema";

export default async function Home() {
  const trips: Trip[] = await sql`
    SELECT id, title, start_date, end_date, description, last_updated_at 
    FROM trips 
    ORDER BY start_date DESC
  `;

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center w-full max-w-6xl">
        <div className="container mx-auto">
          <DataTable columns={columns} data={trips} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

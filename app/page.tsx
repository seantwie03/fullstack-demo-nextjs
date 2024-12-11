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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-6xl">
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={trips} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

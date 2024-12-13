import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import sql from "lib/db";
import { Trip } from "lib/schema";
import Link from "next/link";

export default async function Home() {
  const trips: Trip[] = await sql`
    SELECT id, title, start_date, end_date, description
    FROM trips 
    ORDER BY start_date DESC
  `;

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center w-full max-w-6xl">
        <div className="container mx-auto">
          <div className="flex flex-row justify-end">
            <Link href="trips/new" className="text-gray-600 hover:text-gray-900 transition-colors">
              New Trip
            </Link>
          </div>
          <DataTable columns={columns} data={trips} />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

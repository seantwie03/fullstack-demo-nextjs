import TripForm from "components/TripForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Create a New Trip</h1>
        <TripForm />
      </div>
    </main>
  );
}

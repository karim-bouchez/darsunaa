import { HydrateClient } from "~/trpc/server";
import { AuthSection } from "./_components/auth-section";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Darsunaa
          </h1>
          <AuthSection />
        </div>
      </main>
    </HydrateClient>
  );
}

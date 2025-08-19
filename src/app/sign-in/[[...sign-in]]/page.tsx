import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid h-screen w-screen grid-cols-3 grid-rows-4">
      <section className="col-start-2 row-start-2 justify-self-center">
        <SignIn
          appearance={{
            elements: {},
          }}
        />
      </section>
    </main>
  );
}

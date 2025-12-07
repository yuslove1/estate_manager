import VerifyPhone from "@/components/VerifyPhone";
import LoginPage from "./(auth)/login/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-12">
      {/* <div className="container flex items-center justify-center">
        <div className="estate-bg card p-8 md:p-12 w-full max-w-md text-center">
          <VerifyPhone />

          <p className="text-center text-sm text-[var(--text-light)] mt-6">
            By using this service, you agree to our {" "}
            <a href="/terms" className="text-[var(--accent-turquoise)] hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div> */}
      <LoginPage />
    </main>
  );
}
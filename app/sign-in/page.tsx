import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="relative flex items-start justify-center md:items-start bg-[#1e3a8a] p-6 md:p-10">
          <div className="w-full max-w-2xl">
            <div className="mb-10 md:mb-16 flex items-center gap-3">
              <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">校</span>
              </div>
              <div className="h-12 md:h-14 flex items-center">
                <span className="text-2xl md:text-3xl font-bold text-white">中野坂上校</span>
              </div>
            </div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              中野坂上校へログイン
            </h1>
          </div>
        </section>
        <section className="flex items-center justify-center bg-white p-6 md:p-10">
          <div className="w-full max-w-md">
            <SignIn routing="path" path="/sign-in" afterSignInUrl="/history" signUpUrl="/sign-up" />
            <footer className="mt-10 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center gap-2 text-xs text-gray-500 md:flex-row md:justify-center md:gap-4">
                <a href="#" className="hover:underline">クッキーポリシー</a>
                <span className="hidden md:inline">|</span>
                <a href="#" className="hover:underline">プライバシーポリシー</a>
                <span className="hidden md:inline">|</span>
                <span>© Inter IKEA Systems B.V. 1999–2025</span>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

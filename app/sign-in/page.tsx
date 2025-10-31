import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <section className="relative flex items-start justify-center md:items-start bg-[#0058A3] p-6 md:p-10">
          <div className="w-full max-w-2xl">
            <div className="mb-10 md:mb-16">
              <svg
                className="h-8 md:h-10"
                viewBox="0 0 500 200"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="IKEA"
                role="img"
              >
                <rect width="500" height="200" fill="none" />
                <g transform="translate(70,45)">
                  <path d="M0 0h35v110H0zM70 0h28l18 38 17-38h28l-32 65 32 45h-30l-16-26-18 26H69l33-45zM206 0h95v22h-65v20h58v22h-58v23h67v23h-97zM328 0h31l32 110h-28l-6-23h-28l-7 23h-27zm11 66h18l-9-35z" fill="white" />
                </g>
              </svg>
            </div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              マイページへログイン
            </h1>
          </div>
        </section>
        <section className="flex items-center justify-center bg-white p-6 md:p-10">
          <div className="w-full max-w-md">
            <SignIn routing="path" path="/sign-in" afterSignInUrl="/" signUpUrl="/sign-up" />
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

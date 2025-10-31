"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setSubmitting(true);
    setError("");
    try {
      await signIn.create({ identifier: email, strategy: "email_code" });
      setStep("code");
    } catch (err: any) {
      setError("メール送信に失敗しました。アドレスをご確認ください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await signIn.attemptFirstFactor({ strategy: "email_code", code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/history");
      } else {
        setError("コードの確認に失敗しました。");
      }
    } catch (err: any) {
      setError("コードが無効または有効期限切れです。");
    } finally {
      setSubmitting(false);
    }
  };
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
            {step === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    ワンタイムコードを受け取るには、メールアドレスを入力してください。
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレスを入力"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-black px-4 py-3 text-white text-center text-base font-medium hover:opacity-90 disabled:opacity-60 transition"
                >
                  {submitting ? "送信中..." : "ログイン"}
                </button>
                <div className="text-center">
                  <a href="#" className="text-sm text-gray-700 underline underline-offset-2">
                    パスワードでログイン
                  </a>
                </div>
                
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">メールに届いた6桁コードを入力してください。</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="認証コード"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-black px-4 py-3 text-white text-center text-base font-medium hover:opacity-90 disabled:opacity-60 transition"
                >
                  {submitting ? "確認中..." : "認証して続行"}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                    }}
                    className="text-sm text-gray-700 underline underline-offset-2"
                  >
                    メールアドレスを変更
                  </button>
                </div>
              </form>
            )}
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

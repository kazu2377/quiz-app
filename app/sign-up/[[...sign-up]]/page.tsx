import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">+</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              新規アカウント作成
            </h1>
            <p className="text-gray-600">
              アカウントを作成してクイズを楽しみましょう
            </p>
          </div>

          {/* Clerk SignUp Component */}
          <div className="mb-6">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border-gray-300 hover:bg-gray-50 text-gray-700",
                  socialButtonsBlockButtonText: "font-normal",
                  formButtonPrimary: "bg-green-600 hover:bg-green-700 text-normal font-medium",
                  formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
                  footerActionLink: "text-green-600 hover:text-green-700"
                }
              }}
              redirectUrl="/"
            />
          </div>

          {/* Sign In Link */}
          <div className="text-center border-t pt-6">
            <p className="text-gray-600 text-sm">
              すでにアカウントをお持ちですか？{" "}
              <Link 
                href="/sign-in" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ログイン
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

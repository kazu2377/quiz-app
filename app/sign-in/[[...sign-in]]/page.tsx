import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">Q</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              クイズアプリへようこそ
            </h1>
            <p className="text-gray-600">
              ログインしてクイズを始めましょう
            </p>
          </div>

          {/* Clerk SignIn Component */}
          <div className="mb-6">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border-gray-300 hover:bg-gray-50 text-gray-700",
                  socialButtonsBlockButtonText: "font-normal",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-normal font-medium",
                  formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  footerActionLink: "text-blue-600 hover:text-blue-700"
                }
              }}
              redirectUrl="/"
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center border-t pt-6">
            <p className="text-gray-600 text-sm">
              アカウントをお持ちでないですか？{" "}
              <Link 
                href="/sign-up" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                新規登録
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

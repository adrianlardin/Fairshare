import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="bg-[#0f172a] fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

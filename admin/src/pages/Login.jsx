import { SignIn, useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { ShieldAlert } from "lucide-react";

const Login = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const hasChecked = useRef(false); // ✅ prevent loop

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  /* =========================
     ADMIN CHECK (FIXED LOOP)
  ========================== */
  useEffect(() => {
    if (!isLoaded || hasChecked.current) return;

    if (user) {
      hasChecked.current = true;

      const email = user.primaryEmailAddress?.emailAddress;

      if (email === ADMIN_EMAIL) {
        window.location.href = "/";
      } else {
        setShowBlockedModal(true);
      }
    }
  }, [user, isLoaded]);

  /* =========================
     HANDLE OK CLICK
  ========================== */
  const handleCloseModal = async () => {
    setShowBlockedModal(false);
    hasChecked.current = false; // reset check
    await signOut(); // logout -> Clerk form will show
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-10 relative overflow-hidden">
      
      {/* =========================
          BLOCKED MODAL
      ========================== */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-red-950 via-gray-900 to-black border border-red-500/40 rounded-2xl shadow-[0_0_80px_rgba(255,0,0,0.4)] p-8 text-center">
            
            {/* ICON */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                <ShieldAlert className="text-red-500" size={34} />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-red-500 tracking-wide">
              ACCESS DENIED
            </h2>

            {/* MESSAGE */}
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              You are not authorized to access the admin panel.
              <br />
              This activity has been monitored.
            </p>

            {/* BUTTON */}
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-lg shadow-red-600/20"
            >
              OK
            </button>

            {/* GLOW */}
            <div className="absolute inset-0 rounded-2xl border border-red-500/20 pointer-events-none animate-pulse"></div>
          </div>
        </div>
      )}

      {/* =========================
          LOGIN CARD
          ❗ IMPORTANT: hide when modal open
      ========================== */}
      {!showBlockedModal && (
        <div className="w-full max-w-lg flex items-center justify-center">
          <div className="w-full bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl border border-gray-800/60 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-6 md:p-8 lg:p-10 transition-all duration-300">
            
            {/* HEADER */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                InvestSphere Admin
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Secure admin access
              </p>
            </div>

            {/* CLERK SIGNIN */}
            <div className="flex items-center justify-center">
              <SignIn
                routing="hash"
                signUpUrl={undefined}
                appearance={{
                  elements: {
                    rootBox: "w-full flex justify-center",
                    card: "w-full max-w-md bg-transparent shadow-none border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    footer: "hidden",
                    socialButtonsBlockButton:
                      "bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition",
                    formFieldInput:
                      "bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                    formButtonPrimary:
                      "bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-600/20",
                  },
                }}
              />
            </div>

            {/* FOOTER */}
            <p className="text-xs text-gray-500 text-center mt-8">
              Only authorized admin can access this panel
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  // Signup functionality temporarily disabled
  const router = useRouter();

  const handleJoinWaitlist = () => {
    router.push("/");
    // Wait for navigation to complete, then scroll to waitlist section
    setTimeout(() => {
      const waitlistElement = document.getElementById("waitlist");
      if (waitlistElement) {
        waitlistElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 sm:p-8 text-center">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
            Sign Up Currently Unavailable
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Account creation is temporarily disabled. Please join our waitlist
            to be notified when registration opens.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleJoinWaitlist}
            className="w-full bg-black text-white py-2.5 sm:py-3 px-4 font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Join Waitlist
          </button>

          <p className="text-sm sm:text-base text-gray-600">
            Are you an Admin?{" "}
            <Link
              href="/login"
              className="text-black hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-black text-xs sm:text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );

  /* Original signup functionality - commented out
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  */
}

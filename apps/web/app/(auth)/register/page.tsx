import { AuthLayout } from "@/components/auth/layout/auth-layout";
import RegisterPageClient from "./page-client";

// export const metadata = constructMetadata({
//   title: `Create your ${process.env.NEXT_PUBLIC_APP_NAME} account`,
//   canonicalUrl: `/register`,
// });

export default function RegisterPage() {
  return (
    <AuthLayout showTerms="app">
      <RegisterPageClient />
    </AuthLayout>
  );
}

import { redirect } from "next/navigation";

// Redirect to Swagger UI on the backend
export default function DocsPage() {
  redirect(
    `${process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-65eed.up.railway.app"}/docs`
  );
}

import { redirect } from "next/navigation";

// Redirect to Swagger UI on the backend
export default function DocsPage() {
  redirect(
    `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.filx.io"}/docs`
  );
}

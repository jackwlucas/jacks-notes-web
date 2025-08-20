import { auth } from "@clerk/nextjs/server";

// @ts-expect-error Linter is stupid.
export async function PATCH(request: Request, { params }) {
  // Get session token.
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return new Response("Unauthorized!", { status: 401 });
  }

  // Get the ID and the body.
  const { id } = (await params) as { id: string };
  const body = (await request.json()) as unknown;

  // Make the request to API.
  const response = await fetch(`${process.env.NOTES_API_URL}/api/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // Get text from response.
  const text = await response.text();

  // Return new response.
  return new Response(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

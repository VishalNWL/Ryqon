import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = [
  process.env.ADMIN_1_EMAIL, // ✅ your exact Gmail here
];

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    image: user.imageUrl,
  };
}

export async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  // console.log("🔍 isAdmin check — email:", email);
  return ADMIN_EMAILS.includes(email);
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await getCurrentUser();
  return user!;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  // console.log("🔍 requireAdmin result:", admin);
  if (!admin) throw new Error("Forbidden");
}
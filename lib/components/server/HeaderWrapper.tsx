import { getCurrentUser } from "@/lib/session";
import { HeaderClient } from "../client/HeaderClient";

export async function HeaderWrapper() {
  const user = await getCurrentUser();

  return <HeaderClient user={user} />;
}

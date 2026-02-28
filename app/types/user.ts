import { UserStatus } from "@/types/status";

export interface User {
  id: number | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: UserStatus;
  bio?: string | null;
  creationDate?: string | null;
}
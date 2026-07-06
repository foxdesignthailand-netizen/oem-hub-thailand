import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, SupabaseConfigStatus } from "./types";

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const requiredKeys = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys
  };
}

export function createSupabaseBrowserClient() {
  const { isConfigured } = getSupabaseConfigStatus();

  if (!isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}

export function createSupabaseServerClient() {
  const { isConfigured } = getSupabaseConfigStatus();

  if (!isConfigured) {
    return null;
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

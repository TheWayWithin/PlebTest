// Browser client - use in Client Components
export { createClient } from "./client";

// Server client - use in Server Components, Route Handlers, Server Actions
export { createClient as createServerClient } from "./server";

// Admin client - use only server-side for operations that bypass RLS
export { createAdminClient } from "./admin";

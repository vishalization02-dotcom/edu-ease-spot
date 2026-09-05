import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

type EmailMapping = {
  user_uuid: string;
  email: string;
};

const mappingPath = process.argv[2];
const apply = process.argv.includes("--apply");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

if (!mappingPath) {
  throw new Error("Usage: bun scripts/migrate-auth-emails.ts ./email-mapping.json [--apply]");
}

const url = process.env["SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
if (!url || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the admin environment.");
}

const raw = JSON.parse(await readFile(mappingPath, "utf8")) as unknown;
if (!Array.isArray(raw)) throw new Error("The mapping file must contain a JSON array.");

const mappings = raw.map((entry, index): EmailMapping => {
  if (!entry || typeof entry !== "object") throw new Error(`Mapping ${index + 1} is invalid.`);
  const candidate = entry as Record<string, unknown>;
  const userUuid = typeof candidate.user_uuid === "string" ? candidate.user_uuid.trim() : "";
  const email = typeof candidate.email === "string" ? candidate.email.trim().toLowerCase() : "";
  if (!UUID.test(userUuid)) throw new Error(`Mapping ${index + 1} has an invalid user_uuid.`);
  if (!email || !email.includes("@") || email.length > 254) {
    throw new Error(`Mapping ${index + 1} has an invalid email.`);
  }
  return { user_uuid: userUuid, email };
});

const uuids = new Set<string>();
const emails = new Set<string>();
for (const mapping of mappings) {
  if (uuids.has(mapping.user_uuid)) throw new Error(`Duplicate user_uuid: ${mapping.user_uuid}`);
  if (emails.has(mapping.email)) throw new Error(`Duplicate email: ${mapping.email}`);
  uuids.add(mapping.user_uuid);
  emails.add(mapping.email);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const existing = new Map<string, string | undefined>();
const emailOwners = new Map<string, string>();

for (let page = 1; ; page += 1) {
  const { data, error } = await admin.auth.admin.listUsers({
    page,
    perPage: 1000,
  });

  if (error) {
    throw new Error(`Could not list users: ${error.message}`);
  }

  for (const user of data.users) {
    existing.set(user.id, user.email);

    if (user.email) {
      emailOwners.set(user.email.trim().toLowerCase(), user.id);
    }
  }

  if (data.users.length < 1000) break;
}
for (const mapping of mappings) {
  const currentEmail = existing.get(mapping.user_uuid);

  if (!currentEmail) {
    throw new Error(`User UUID not found: ${mapping.user_uuid}`);
  }

  const owner = emailOwners.get(mapping.email);

  if (owner && owner !== mapping.user_uuid) {
    throw new Error(
      `Target email already belongs to another user: ${mapping.email}`,
    );
  }

  console.log(
    `${apply ? "Updating" : "Would update"} ${mapping.user_uuid}: ${currentEmail} -> ${mapping.email}`,
  );
}

if (!apply) {
  console.log("Dry run complete. Re-run with --apply to update Auth emails. User UUIDs and foreign keys are never changed.");
  process.exit(0);
}

for (const mapping of mappings) {
  const { error } = await admin.auth.admin.updateUserById(mapping.user_uuid, {
    email: mapping.email,
    email_confirm: true,
  });
  if (error) throw new Error(`Could not update ${mapping.user_uuid}: ${error.message}`);
}

console.log(`Updated ${mappings.length} Auth email(s). No users were recreated.`);
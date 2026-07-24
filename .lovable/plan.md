## What changes

### 1. No auto "Default Class" for new teachers
Verified: the `handle_new_teacher` trigger only inserts a `teachers` profile — no class is auto-created for new signups. The old "Default Class" was a one-time backfill for pre-existing students in a prior migration, not ongoing behavior. No code or trigger change needed on the create-path.

Optional cleanup (data-only, via insert tool): delete any leftover `"Default Class"` rows that have **zero students**. Rows still holding students are left alone so we don't orphan data. Confirm before running.

### 2. Empty-state + mandatory class rules (UI)

**Classes page (`src/routes/_authenticated/classes.tsx`)**
Replace current empty state with:
- Heading: "No classes created yet."
- Primary button: **"Create Your First Class"** → opens the Add Class dialog.

**Students page (`src/routes/_authenticated/students.tsx`)**
- When `classes.length === 0`: hide the table/search, show a blocking empty state card:
  - "Please create a class before adding students."
  - Primary button **"Create Class"** → navigates to `/classes`.
- "Add Student" button stays disabled while no class exists (already is), plus the class field in the form is already required.

**Dashboard (see §3)** also shows the same empty state when no classes exist.

### 3. Dashboard "Your Classes" redesign

Replace the current all-classes grid with a lightweight **top-3** section.

Data strategy (kept lightweight — no fan-out of queries per class):
- Fetch classes (already cached).
- Fetch **only the student rows needed for counts + IDs** for all classes (already cached via `["students","all"]`) — this is one query and drives the sort.
- Sort classes by student count desc, slice to **top 3**.
- Compute the student-id set for those top-3 classes only.
- Reuse the already-cached `["attendance","day",today]` and `["fees","month",month]` queries (dashboard already fetches these) and derive per-class stats client-side by grouping on `student_id → class_id`. **No extra network calls** beyond what the dashboard already does.

Each card shows:
- Class name
- Total students
- Today's attendance: `X present · Y absent`
- Pending fees (current month): `₹N` — sum of `monthly_fee` for students in that class without a `paid` fee row this month.

Card behavior:
- Entire card is clickable → navigates to the **Class Dashboard** at `/classes/$id` (new route, see below).
- Header row: "Your Classes" + right-aligned **"View All →"** button linking to `/classes`.
- Empty state (no classes): "No classes created yet." + "Create Your First Class" button → `/classes`.
- If 1–2 classes exist, show all of them (no top-3 padding).

### 4. New Class Dashboard route
Add `src/routes/_authenticated/classes.$id.tsx`:
- Header with class name + description, "Back to Classes" link.
- Stat cards scoped to this class: Total Students, Today's Attendance (present/absent), Pending Fees (this month), Fees Collected (this month).
- Quick links: Students / Attendance / Fees (existing pages — the class selector on each already scopes data; we pass no state, teacher picks class there, which matches current UX).
- All queries scoped by `student_id IN (studentIds of this class)` reusing existing fetchers (`fetchStudents(classId)`, `fetchAttendance({ date, studentIds })`, `fetchFees({ month, studentIds })`) — same shape as dashboard, no new indexes needed.

### 5. Files touched
- `src/routes/_authenticated/dashboard.tsx` — rewrite "Your Classes" section, add derivations, add empty state, "View All".
- `src/routes/_authenticated/classes.tsx` — new empty state copy + "Create Your First Class" primary button.
- `src/routes/_authenticated/students.tsx` — replace inline no-class card with blocking empty state + "Create Class" button linking to `/classes`.
- `src/routes/_authenticated/classes.$id.tsx` — **new** class dashboard route.

No DB migration required (optional data cleanup only, run separately if you approve).

## Question before I build
Do you want me to **delete leftover empty "Default Class" rows** for existing teachers (only ones with zero students)? Reply yes/no in your next message; default is **no** if you don't say.
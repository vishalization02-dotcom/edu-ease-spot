
-- 1) classes table
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teacher owns classes" ON public.classes
  FOR ALL TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE INDEX idx_classes_teacher ON public.classes(teacher_id);

-- 2) add class_id to students
ALTER TABLE public.students ADD COLUMN class_id uuid REFERENCES public.classes(id) ON DELETE RESTRICT;

-- 3) backfill: for each teacher with students, create a Default Class and assign
DO $$
DECLARE
  t record;
  new_class uuid;
BEGIN
  FOR t IN SELECT DISTINCT teacher_id FROM public.students WHERE class_id IS NULL LOOP
    INSERT INTO public.classes (teacher_id, name, description)
    VALUES (t.teacher_id, 'Default Class', 'Auto-created for existing students')
    RETURNING id INTO new_class;
    UPDATE public.students SET class_id = new_class WHERE teacher_id = t.teacher_id AND class_id IS NULL;
  END LOOP;
END $$;

-- 4) make class_id required going forward
ALTER TABLE public.students ALTER COLUMN class_id SET NOT NULL;

-- 5) indexes for performance
CREATE INDEX idx_students_teacher ON public.students(teacher_id);
CREATE INDEX idx_students_class ON public.students(class_id);

CREATE INDEX idx_attendance_teacher_date ON public.attendance(teacher_id, date DESC);
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, date DESC);

CREATE INDEX idx_fees_teacher_month ON public.fees(teacher_id, month);
CREATE INDEX idx_fees_student_month ON public.fees(student_id, month);

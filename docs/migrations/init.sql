-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.challenge_examples (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL,
  input text NOT NULL,
  output text NOT NULL,
  explanation text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenge_examples_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_examples_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id)
);
CREATE TABLE public.challenge_progress (
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL,
  best_status text NOT NULL,
  last_submission_id uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT challenge_progress_pkey PRIMARY KEY (user_id, challenge_id),
  CONSTRAINT challenge_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT challenge_progress_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES devsharper.challenges(id),
  CONSTRAINT challenge_progress_last_submission_id_fkey FOREIGN KEY (last_submission_id) REFERENCES devsharper.submissions(id)
);
CREATE TABLE public.challenge_test_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL,
  input text NOT NULL,
  expected_output text NOT NULL,
  is_hidden boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenge_test_cases_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_test_cases_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id)
);
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  category text NOT NULL,
  skills ARRAY NOT NULL,
  problem_statement text,
  initial_code text,
  function_name text,
  tags ARRAY,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  display_order integer DEFAULT 0,
  order_index integer,
  status character varying DEFAULT 'approved'::character varying,
  test_cases jsonb DEFAULT '[]'::jsonb,
  examples jsonb DEFAULT '[]'::jsonb,
  constraints ARRAY DEFAULT '{}'::text[],
  is_public boolean DEFAULT true,
  mentor text NOT NULL DEFAULT 'Samuel'::text,
  slug text,
  max_score integer DEFAULT 100,
  created_by uuid,
  image_url text,
  CONSTRAINT challenges_pkey PRIMARY KEY (id)
);
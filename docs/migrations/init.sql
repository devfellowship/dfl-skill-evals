-- Tabela principal: challenges
CREATE TABLE skill_evals.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  category text NOT NULL,
  skills text[] NOT NULL,
  problem_statement text,
  initial_code text,
  function_name text,
  tags text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  order_index integer,
  status character varying DEFAULT 'approved'::character varying,
  constraints text[] DEFAULT '{}'::text[],
  is_public boolean DEFAULT true,
  mentor text NOT NULL DEFAULT 'Samuel'::text,
  slug text,
  max_score integer DEFAULT 100,
  created_by uuid,
  image_url text,
  CONSTRAINT challenges_pkey PRIMARY KEY (id)
);

-- Tabela de exemplos de uso para cada desafio
CREATE TABLE skill_evals.challenge_examples (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL,
  input text NOT NULL,
  output text NOT NULL,
  explanation text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenge_examples_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_examples_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES skill_evals.challenges(id)
);

-- Tabela de casos de teste para avaliação automática
CREATE TABLE skill_evals.challenge_test_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL,
  input text NOT NULL,
  expected_output text NOT NULL,
  is_hidden boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenge_test_cases_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_test_cases_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES skill_evals.challenges(id)
);
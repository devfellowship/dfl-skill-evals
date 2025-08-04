// /src/Judge0/pages/api/execute-code.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { runCode } from "@/Judge0/lib/judge";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { source_code, language_id, stdin } = req.body;

  try {
    const result = await runCode({ source_code, language_id, stdin });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao executar código", details: err });
  }
}

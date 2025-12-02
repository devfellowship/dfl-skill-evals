
type RunCodeParams = {
    source_code: string;
    language_id: number;
    stdin?: string;
  };

export async function runCode({ source_code, language_id, stdin = "" }: RunCodeParams) {
    const url = (process.env.JUDGE0_API_URL || "https://judge0.devfellowship.com").replace(/\/$/, '');
    const body = {
      source_code,
      language_id,
      stdin,
    };
    const response = await fetch(`${url}/submissions?wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }
  
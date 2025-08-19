"use client";

import { use } from "react";
import {
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";

import { Badge } from "@/components/atoms/Badge/Badge";
import { Separator } from "@/components/ui/separator";

import { CodeEditor } from "@/components/organisms/CodeEditor/CodeEditor";
import { ChallengeRightSidebar } from "@/components/organisms/ChallengeRightSidebar";
import { ChallengeHeader } from "@/components/organisms/ChallengeHeader";
import { CompilationError } from "@/components/molecules/CompilationError";
import { Hints } from "@/components/molecules/Hints";
import { ProblemExample } from "@/components/molecules/ProblemExample";
import Link from "next/link";
import { EXECUTION_LIMITS } from "@/consts/ui";
import { useChallengeDetailsPage } from "@/hooks/useChallengeDetailsPage";

export default function Assessment({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    assessment,
    problem,
    currentProblem,
    code,
    timeLeft,
    isRunning,
    testResults,
    showHints,
    hintsUsed,
    compilationError,
    passedTests,
    totalVisibleTests,
    totalTests,
    hiddenTests,
    setCurrentProblem,
    setCode,
    runCode,
    handleHint,
    formatTime,
    getTimeColor,
  } = useChallengeDetailsPage(id);

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChallengeHeader
        challengeId={id}
        timeLeft={timeLeft}
        currentProblem={currentProblem}
        hintsUsed={hintsUsed}
        formatTime={formatTime}
        getTimeColor={getTimeColor}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[30%] border-r border-border/40 overflow-auto bg-background">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
                <Badge
                  variant={
                    problem.difficulty === "Easy"
                      ? "secondary"
                      : problem.difficulty === "Medium"
                      ? "default"
                      : "destructive"
                  }
                  className="mb-4"
                >
                  {problem.difficulty}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Examples</h3>
                <div className="space-y-3">
                  {problem.examples.map((example, index) => (
                    <ProblemExample
                      key={index}
                      example={example}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Constraints</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              <Hints
                hints={problem.hints}
                hintsUsed={hintsUsed}
                showHints={showHints}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-border/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Solution</h3>
                <div className="flex items-center gap-2">
                  {hintsUsed < EXECUTION_LIMITS.MAX_HINTS && (
                    <Button variant="outline" size="sm" onClick={handleHint}>
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Get Hint ({hintsUsed}/{EXECUTION_LIMITS.MAX_HINTS})
                    </Button>
                  )}
                  <Button onClick={runCode} disabled={isRunning} size="sm">
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </div>
            </div>

            {compilationError && <CompilationError error={compilationError} />}

            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="typescript"
                onRun={runCode}
                isRunning={isRunning}
                showRunButton={true}
              />
            </div>
          </div>

          <ChallengeRightSidebar
            testResults={testResults}
            passedTests={passedTests}
            totalTests={totalTests}
            hiddenTests={hiddenTests}
            testCases={problem.testCases}
          />
        </div>
      </div>
    </div>
  );
}

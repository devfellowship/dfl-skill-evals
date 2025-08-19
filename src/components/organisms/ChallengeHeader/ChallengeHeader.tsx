"use client";

import {
  Clock,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumb, createChallengeBreadcrumb } from "@/components/molecules/AppBreadcrumb";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXECUTION_LIMITS } from "@/consts/ui";

interface ChallengeHeaderProps {
  challengeId: string;
  timeLeft: number;
  currentProblem: number;
  hintsUsed: number;
  formatTime: (time: number) => string;
  getTimeColor: () => string;
}

export function ChallengeHeader({
  challengeId,
  timeLeft,
  currentProblem,
  hintsUsed,
  formatTime,
  getTimeColor,
}: ChallengeHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <AppBreadcrumb items={createChallengeBreadcrumb(challengeId)} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${getTimeColor()}`} />
              <span className={`font-mono text-sm ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Problem {currentProblem + 1} of 3
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-sm text-muted-foreground">
              Hints used: {hintsUsed}/{EXECUTION_LIMITS.MAX_HINTS}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

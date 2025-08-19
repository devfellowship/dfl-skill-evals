import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BREADCRUMB_LABELS } from "@/consts/ui";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
};

export interface AppBreadcrumbProps {
  items?: BreadcrumbItem[];
  challengeId?: string;
}

export function AppBreadcrumb({ items, challengeId }: AppBreadcrumbProps) {
  // Se não há items customizados, gera baseado na página atual
  const breadcrumbItems = items || generateDefaultBreadcrumbs(challengeId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home sempre é o primeiro item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href!}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function generateDefaultBreadcrumbs(challengeId?: string): BreadcrumbItem[] {
  if (!challengeId) {
    return [];
  }

  // Para páginas que usam challengeId, podemos inferir a estrutura
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  if (currentPath.includes("/pre-challenge/")) {
    return [
      {
        label: BREADCRUMB_LABELS.PRE_CHALLENGE,
        isCurrentPage: true,
      },
    ];
  }

  if (currentPath.includes("/challenge/")) {
    return [
      {
        label: BREADCRUMB_LABELS.PRE_CHALLENGE,
        href: `/pre-challenge/${challengeId}`,
      },
      {
        label: BREADCRUMB_LABELS.CHALLENGE,
        isCurrentPage: true,
      },
    ];
  }

  if (currentPath.includes("/results")) {
    return [
      {
        label: BREADCRUMB_LABELS.PRE_CHALLENGE,
        href: `/pre-challenge/${challengeId}`,
      },
      {
        label: BREADCRUMB_LABELS.CHALLENGE,
        href: `/challenge/${challengeId}`,
      },
      {
        label: BREADCRUMB_LABELS.RESULTS,
        isCurrentPage: true,
      },
    ];
  }

  return [];
}

// Funções helper para criar breadcrumbs específicos
export const createPreChallengeBreadcrumb = (): BreadcrumbItem[] => [
  {
    label: BREADCRUMB_LABELS.PRE_CHALLENGE,
    isCurrentPage: true,
  },
];

export const createChallengeBreadcrumb = (challengeId: string): BreadcrumbItem[] => [
  {
    label: BREADCRUMB_LABELS.PRE_CHALLENGE,
    href: `/pre-challenge/${challengeId}`,
  },
  {
    label: BREADCRUMB_LABELS.CHALLENGE,
    isCurrentPage: true,
  },
];

export const createResultsBreadcrumb = (challengeId: string): BreadcrumbItem[] => [
  {
    label: BREADCRUMB_LABELS.PRE_CHALLENGE,
    href: `/pre-challenge/${challengeId}`,
  },
  {
    label: BREADCRUMB_LABELS.CHALLENGE,
    href: `/challenge/${challengeId}`,
  },
  {
    label: BREADCRUMB_LABELS.RESULTS,
    isCurrentPage: true,
  },
];

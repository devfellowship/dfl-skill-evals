"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BREADCRUMB_LABELS } from "@/consts/ui";
interface BreadcrumbItem {
  href?: string;
  label: string;
  isCurrentPage?: boolean;
}
interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
}
export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export function createChallengeBreadcrumb(challengeId: string): BreadcrumbItem[] {
  return [
    {
      href: "/",
      label: BREADCRUMB_LABELS.HOME,
    },
    {
              href: `/challenge/pre/${challengeId}`,
      label: BREADCRUMB_LABELS.PRE_CHALLENGE,
    },
    {
      label: BREADCRUMB_LABELS.CHALLENGE,
      isCurrentPage: true,
    },
  ];
}
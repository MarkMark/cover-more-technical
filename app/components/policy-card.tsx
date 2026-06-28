import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Policy } from "@/lib/api/policies";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";

type PolicyCardModel = {
  documents: Array<{ href: string; label: string }>;
  factGroups: Array<Array<{ label: string; value: string }>>;
  policyNumber: string;
};

type PolicyCardProps = {
  policy: Policy;
};

export function PolicyCard({ policy }: PolicyCardProps) {
  const model = getPolicyCardModel(policy);

  return (
    <PolicyCardRoot>
      <PolicyCardMain>
        <PolicyCardHeader policyNumber={model.policyNumber} />
        <PolicyCardFacts factGroups={model.factGroups} />
        <PolicyCardDocuments documents={model.documents} />
      </PolicyCardMain>
      <PolicyCardActions />
    </PolicyCardRoot>
  );
}

function PolicyCardRoot({ children }: { children: ReactNode }) {
  return (
    <Card className={cn("ring-0")}>
      <CardContent
        className={cn(
          "grid",
          "gap-8",
          "md:grid-cols-[1fr_auto] md:items-start",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}

function PolicyCardMain({ children }: { children: ReactNode }) {
  return <div className={cn("grid", "gap-8")}>{children}</div>;
}

function PolicyCardHeader({ policyNumber }: { policyNumber: string }) {
  return (
    <CardHeader className={cn("px-0")}>
      <CardTitle className={cn("text-xl", "md:text-2xl")}>
        <span className={cn("font-semibold", "text-primary")}>
          Policy number:
        </span>{" "}
        <span className={cn("font-normal", "text-foreground")}>
          {policyNumber}
        </span>
      </CardTitle>
    </CardHeader>
  );
}

function PolicyCardFacts({
  factGroups,
}: {
  factGroups: PolicyCardModel["factGroups"];
}) {
  return (
    <div className={cn("grid", "items-start gap-1", "md:grid-cols-2 md:gap-8")}>
      {factGroups.map((facts, index) => (
        <PolicyCardFactGroup key={index} hasDivider={index === 0}>
          {facts.map((fact) => (
            <PolicyCardFact key={fact.label} {...fact} />
          ))}
        </PolicyCardFactGroup>
      ))}
    </div>
  );
}

function PolicyCardFactGroup({
  children,
  hasDivider,
}: {
  children: ReactNode;
  hasDivider: boolean;
}) {
  return (
    <dl className={cn("grid", "gap-1", hasDivider && "md:border-r md:pr-8")}>
      {children}
    </dl>
  );
}

function PolicyCardFact({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("text-sm")}>
      <dt className={cn("inline", "font-semibold")}>{label}: </dt>
      <dd className={cn("inline")}>{value}</dd>
    </div>
  );
}

function PolicyCardDocuments({
  documents,
}: {
  documents: PolicyCardModel["documents"];
}) {
  return (
    <div className={cn("flex flex-wrap", "gap-x-8 gap-y-3")}>
      {documents.map((document) => (
        <Link
          className={cn(
            "inline-flex items-center",
            "gap-2",
            "text-xs underline underline-offset-2",
          )}
          href={document.href}
          key={document.label}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink aria-hidden="true" className={cn("size-4")} />
          {document.label}
        </Link>
      ))}
    </div>
  );
}

function PolicyCardActions() {
  return (
    <div className={cn("grid", "gap-2", "md:pt-2")}>
      <Button size="lg">Make a claim</Button>
      <Button size="lg" variant="outline">
        Manage my policy
      </Button>
    </div>
  );
}

function getPolicyCardModel(policy: Policy): PolicyCardModel {
  const destination = policy.destinations
    .map((policyDestination) => policyDestination.name)
    .join(", ");

  const plan = getPolicyPlanLabel(policy);
  const excess = formatCurrency(policy.excess);

  const firstGroup =
    policy.type === "Annual"
      ? [
          { label: "Destination", value: destination },
          { label: "Policy start date", value: formatDate(policy.policyStart) },
          {
            label: "Maximum trip duration",
            value: `Up to ${policy.maxTripDuration} days`,
          },
        ]
      : [
          { label: "Destination", value: destination },
          {
            label: "Travel date",
            value: formatDateRange(policy.policyStart, policy.policyEnd),
          },
        ];

  return {
    documents: [
      { href: "#view-pds", label: "View PDS" },
      {
        href: "#certificate-of-insurance",
        label: "Certificate of Insurance",
      },
    ],
    factGroups: [
      firstGroup,
      [
        { label: "Plan", value: plan },
        { label: "Excess", value: excess },
      ],
    ],
    policyNumber: policy.policyNumber,
  };
}

function getPolicyPlanLabel(policy: Policy) {
  if (policy.type === "Annual") {
    return "Annual Multi-trip";
  }

  return "International comprehensive";
}

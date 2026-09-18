"use client";

import type { MouseEvent, ReactNode } from "react";

export default function AnchorLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    onNavigate?.();
    // `start` + the scroll-mt-* on each target keeps the fixed header from
    // covering the heading; the targets declare their own offset.
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

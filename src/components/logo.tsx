import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>TASIA Logo</title>
      <path d="M2 3h20" />
      <path d="M12 3v18" />
      <path d="M7 21h10" />
    </svg>
  );
}

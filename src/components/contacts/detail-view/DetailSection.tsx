"use client";

import React from "react";

export const DetailSection = ({
  title,
  children,
  icon,
  alwaysShow = false,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
  alwaysShow?: boolean;
}) => {
  const hasContent =
    React.Children.count(children) > 0 &&
    (Array.isArray(children) ? children.filter((c) => c).length > 0 : true);

  if (!hasContent && !alwaysShow) {
    return null;
  }

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="flex items-center text-lg font-semibold mb-3 text-primary">
        {React.createElement(icon, { className: "mr-2 h-5 w-5" })}
        {title}
      </h3>
      <div className="space-y-3 pl-7">
        {hasContent ? (
          children
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Δεν υπάρχουν καταχωρημένα στοιχεία.
          </p>
        )}
      </div>
    </div>
  );
};

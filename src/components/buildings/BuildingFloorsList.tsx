"use client";

import React from "react";
import { BuildingFloorsList as BuildingFloorsListRefactored } from "./building-floors-list/building-floors-list";
import type { Building } from "@/lib/types/project-types";

interface BuildingFloorsListProps {
  building: Building;
}

export function BuildingFloorsList({ building }: BuildingFloorsListProps) {
  return <BuildingFloorsListRefactored building={building} />;
}

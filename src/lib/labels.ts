import type { Role } from "../../shared/types";

export const EQUIPMENT_LABELS: Record<string, string> = {
  projector: "Projector",
  whiteboard: "Whiteboard",
  video_conferencing: "Video conferencing",
};

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  office_manager: "Office Manager",
  admin: "Admin",
};

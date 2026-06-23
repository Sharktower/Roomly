export type Role = "employee" | "office_manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managedOffice?: string;
}

export type Equipment = "projector" | "whiteboard" | "video_conferencing";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  office: string;
  equipment: Equipment[];
}

export type BookingStatus = "confirmed" | "cancelled" | "rejected";

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  start: string;
  end: string;
  status: BookingStatus;
  attendees: number;
  createdAt: string;
  cancelledAt?: string;
}

export interface ApiError {
  error: string;
}

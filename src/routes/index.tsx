import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useAllBookings, useRooms } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInMinutes, format, isAfter, isBefore, startOfDay, addDays } from "date-fns";
import { Calendar, Clock, DoorOpen, TrendingUp, XCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Dashboard — Roomly" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading: bookingsLoading } = useAllBookings();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();

  const now = new Date();
  const weekStart = startOfDay(now);
  const weekEnd = addDays(weekStart, 7);

  if (bookingsLoading || roomsLoading) {
    return <div className="text-sm text-muted-foreground">Loading dashboard…</div>;
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const upcoming = confirmed
    .filter((b) => isAfter(new Date(b.end), now))
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))
    .slice(0, 6);

  const cancelled = bookings
    .filter((b) => b.status === "cancelled")
    .sort((a, b) => +new Date(b.cancelledAt ?? b.start) - +new Date(a.cancelledAt ?? a.start))
    .slice(0, 5);

  const inWeek = confirmed.filter(
    (b) => isAfter(new Date(b.start), weekStart) && isBefore(new Date(b.start), weekEnd),
  );
  const totalBookedMin = inWeek.reduce(
    (acc, b) => acc + differenceInMinutes(new Date(b.end), new Date(b.start)),
    0,
  );
  const capacityMin = rooms.length * 8 * 60 * 5;
  const utilisationPct = Math.min(100, Math.round((totalBookedMin / capacityMin) * 100));

  const roomUtil = rooms
    .map((r) => {
      const mins = inWeek
        .filter((b) => b.roomId === r.id)
        .reduce((a, b) => a + differenceInMinutes(new Date(b.end), new Date(b.start)), 0);
      const pct = Math.min(100, Math.round((mins / (8 * 60 * 5)) * 100));
      return { room: r, pct, hours: Math.round(mins / 60) };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{format(now, "EEEE, d MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Upcoming bookings" value={upcoming.length} />
        <StatCard icon={DoorOpen} label="Rooms" value={rooms.length} />
        <StatCard icon={TrendingUp} label="This week utilisation" value={`${utilisationPct}%`} />
        <StatCard icon={XCircle} label="Recently cancelled" value={cancelled.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming bookings</h2>
            <span className="text-xs text-muted-foreground">Next 6</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No upcoming bookings.</p>
          ) : (
            <ul className="divide-y">
              {upcoming.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                return (
                  <li key={b.id} className="py-3 flex items-center gap-4">
                    <div className="size-10 rounded-md bg-accent text-accent-foreground grid place-items-center">
                      <Clock className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {room?.name} · {room?.office}
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">{format(new Date(b.start), "EEE d MMM")}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(b.start), "HH:mm")}–{format(new Date(b.end), "HH:mm")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4">Recently cancelled</h2>
          {cancelled.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No recent cancellations.</p>
          ) : (
            <ul className="space-y-3">
              {cancelled.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                return (
                  <li key={b.id} className="flex items-start gap-3">
                    <div className="size-2 rounded-full bg-destructive mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{b.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {room?.name} · {format(new Date(b.start), "d MMM HH:mm")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Room utilisation</h2>
          <Badge variant="secondary">This week</Badge>
        </div>
        <div className="space-y-3">
          {roomUtil.map(({ room, pct, hours }) => (
            <div key={room.id} className="grid grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {room.name}{" "}
                    <span className="text-muted-foreground font-normal">· {room.office}</span>
                  </span>
                  <span className="text-muted-foreground text-xs">{hours}h booked</span>
                </div>
                <div className="h-2 mt-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium tabular-nums w-10 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-md bg-accent text-accent-foreground grid place-items-center">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold tabular-nums">{value}</div>
        </div>
      </div>
    </Card>
  );
}

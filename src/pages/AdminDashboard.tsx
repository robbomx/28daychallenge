import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { adminGetUsers, type AdminUserRow } from "../lib/api";
import { clearAdminToken, getAdminToken } from "../lib/storage";

function daysSince(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }
    adminGetUsers(token)
      .then(({ users }) => setUsers(users))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load users.");
        if (err instanceof Error && /admin/i.test(err.message)) {
          clearAdminToken();
          navigate("/admin/login");
        }
      });
  }, [navigate]);

  const stats = useMemo(() => {
    if (!users) return null;
    const total = users.length;
    const paid = users.filter((u) => u.paid).length;
    const active7d = users.filter((u) => {
      const d = daysSince(u.lastActiveAt);
      return d !== null && d <= 7;
    }).length;
    const stalled = users.filter((u) => {
      if (!u.paid) return false;
      const d = daysSince(u.lastActiveAt);
      const completed = u.progressSummary?.totalCompleted ?? 0;
      return d !== null && d >= 3 && completed < 28;
    }).length;
    return { total, paid, active7d, stalled };
  }, [users]);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <span className="mono-label text-xs text-op-orange">Command Center</span>
          <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-1">Admin Dashboard</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      {error && <p className="text-sm text-op-error mb-6">{error}</p>}

      {stats && (
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          <Card variant="panel" className="p-5">
            <p className="mono-label text-xs text-op-off-white-dim">Total Signups</p>
            <p className="font-display text-3xl text-op-off-white mt-2">{stats.total}</p>
          </Card>
          <Card variant="panel" className="p-5">
            <p className="mono-label text-xs text-op-off-white-dim">Paid</p>
            <p className="font-display text-3xl text-op-success mt-2">{stats.paid}</p>
            <p className="text-xs text-op-off-white-dim mt-1">
              {stats.total ? Math.round((stats.paid / stats.total) * 100) : 0}% conversion
            </p>
          </Card>
          <Card variant="panel" className="p-5">
            <p className="mono-label text-xs text-op-off-white-dim">Active Last 7 Days</p>
            <p className="font-display text-3xl text-op-off-white mt-2">{stats.active7d}</p>
          </Card>
          <Card variant="panel" className="p-5 border-op-error/40">
            <p className="mono-label text-xs text-op-off-white-dim">Stalled (3+ days idle)</p>
            <p className="font-display text-3xl text-op-error mt-2">{stats.stalled}</p>
            <p className="text-xs text-op-off-white-dim mt-1">Paid, mid-program, gone quiet</p>
          </Card>
        </div>
      )}

      <Card variant="panel" className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-op-line text-left">
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Signed Up</Th>
              <Th>Paid</Th>
              <Th>Level</Th>
              <Th>Goal</Th>
              <Th>Profile</Th>
              <Th>Day</Th>
              <Th>Completed</Th>
              <Th>Streak</Th>
              <Th>Last Active</Th>
            </tr>
          </thead>
          <tbody>
            {users === null && !error && (
              <tr>
                <td colSpan={11} className="text-center py-10 text-op-off-white-dim text-xs">
                  Loading…
                </td>
              </tr>
            )}
            {users?.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-10 text-op-off-white-dim text-xs">
                  No signups yet.
                </td>
              </tr>
            )}
            {users?.map((u) => {
              const idleDays = daysSince(u.lastActiveAt);
              const stalledRow = u.paid && idleDays !== null && idleDays >= 3 && (u.progressSummary?.totalCompleted ?? 0) < 28;
              return (
                <tr key={u.id} className={`border-b border-op-line/60 align-top ${stalledRow ? "bg-op-error/5" : ""}`}>
                  <Td className="text-op-off-white">{u.firstName}</Td>
                  <Td>{u.email}</Td>
                  <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Badge tone={u.paid ? "success" : "warning"}>{u.paid ? "Paid" : "Pending"}</Badge>
                  </Td>
                  <Td>{u.fitnessLevel}</Td>
                  <Td>{u.goal}</Td>
                  <Td className="max-w-[220px]">
                    {u.profile ? (
                      <div className="flex flex-col gap-0.5 text-xs text-op-off-white-dim">
                        <span>
                          {u.profile.age} · {u.profile.gender} · {u.profile.bodyType}
                        </span>
                        <span>{u.profile.desiredOutcome}</span>
                        {u.profile.notes && <span className="text-op-sand">"{u.profile.notes}"</span>}
                      </div>
                    ) : (
                      <span className="text-op-off-white-dim/50">—</span>
                    )}
                  </Td>
                  <Td>{u.progressSummary?.currentDay ?? "—"}</Td>
                  <Td>{u.progressSummary?.totalCompleted ?? 0}/28</Td>
                  <Td>{u.progressSummary?.streak ?? 0}</Td>
                  <Td>
                    {u.lastActiveAt ? (
                      <span className={stalledRow ? "text-op-error" : ""}>
                        {idleDays === 0 ? "Today" : `${idleDays}d ago`}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="mono-label text-[11px] text-op-off-white-dim px-4 py-3 whitespace-nowrap">{children}</th>;
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-xs text-op-off-white-dim whitespace-nowrap ${className}`}>{children}</td>;
}

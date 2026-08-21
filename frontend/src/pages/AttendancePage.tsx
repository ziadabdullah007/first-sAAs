// src/pages/AttendancePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc, IconCheck, IconX } from "../components/ui/Icons";
import { members as membersApi } from "../api/members";
import { attendance as attendanceApi } from "../api/attendance";

const PER_PAGE = 10;
type AttendanceStatus = "checked_in" | "checked_out";
type SortKey = "memberName" | "checkInTime" | "checkOutTime" | "status";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

const fmtTime = (d: string | null | undefined) => {
  if (!d) return null;
  try { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return d; }
};

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
};

export default function AttendancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("checkInTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attData, memData] = await Promise.all([
          attendanceApi.getAttendance(),
          membersApi.getMembers()
        ]);
        setAttendanceList(attData);
        setMembersList(memData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const getMemberName = (memberId: string) => {
    const member = membersList.find(m => m.id === memberId);
    return member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() : "Unknown Member";
  };

  const getMemberInitials = (memberId: string) => {
    const member = membersList.find(m => m.id === memberId);
    if (!member) return "??";
    return `${(member.first_name || '')[0] || ''}${(member.last_name || '')[0] || ''}`.toUpperCase();
  };

  const filtered = attendanceList.filter((a) => {
    const q = search.toLowerCase();
    const memberName = getMemberName(a.member_id).toLowerCase();
    const matchSearch = !q || memberName.includes(q);
    const matchStatus = !statusFilter ||
      (statusFilter === "checked_in" && !a.check_out_time) ||
      (statusFilter === "checked_out" && !!a.check_out_time);
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "memberName") {
      av = getMemberName(a.member_id);
      bv = getMemberName(b.member_id);
    } else if (sortKey === "checkInTime") {
      av = a.check_in_time ?? "";
      bv = b.check_in_time ?? "";
    } else if (sortKey === "checkOutTime") {
      av = a.check_out_time ?? "";
      bv = b.check_out_time ?? "";
    } else if (sortKey === "status") {
      av = a.check_out_time ? "checked_out" : "checked_in";
      bv = b.check_out_time ? "checked_out" : "checked_in";
    }
    return sortDir === "asc" ?
      (av < bv ? -1 : av > bv ? 1 : 0) :
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const checkedInNow = attendanceList.filter(a => !a.check_out_time).length;

  return (
    <div className="p-6 space-y-4 max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">Attendance Log</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{attendanceList.length} total records</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{checkedInNow} currently inside</span>
          </div>
        </div>
        <Button size="sm" onClick={() => navigate("/members")}>
          <IconCheck size={13} /> Check In Member
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
          <div className="text-sm text-red-800">{error}</div>
          <Button onClick={() => setError(null)} size="sm" variant="secondary" className="mt-2">
            Dismiss
          </Button>
        </div>
      )}

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <Input
            placeholder="Member name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-lg">
          {([["", "All"], ["checked_in", "Checked In"], ["checked_out", "Checked Out"]] as [AttendanceStatus | "", string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setStatusFilter(val); setPage(1); }}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${statusFilter === val ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }} className="text-[11px] text-[#1d4ed8] hover:underline">
            Clear
          </button>
        )}
        <div className="ml-auto text-[11px] text-[#9b9895]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("memberName")}>
                  Member <SortIcon col="memberName" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("checkInTime")}>
                  Check-In <SortIcon col="checkInTime" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5">Check-Out</th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon col="status" active={sortKey} dir={sortDir} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      title="No attendance records found"
                      description={search || statusFilter ? "Try adjusting your search or filters." : "Check in a member to start tracking attendance."}
                      action={{ label: "Check In Member", onClick: () => navigate("/members") }}
                    />
                  </td>
                </tr>
              ) : paged.map((a) => {
                const memberName = getMemberName(a.member_id);
                const initials = getMemberInitials(a.member_id);
                const isCheckedIn = !a.check_out_time;
                return (
                  <tr key={a.id} className="hover:bg-[#fafaf9] transition-colors group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={initials} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-[12px] text-[#111110] font-mono">{fmtTime(a.check_in_time)}</div>
                      <div className="text-[10px] text-[#9b9895]">{fmtDate(a.check_in_time)}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      {a.check_out_time ? (
                        <>
                          <div className="text-[12px] text-[#6b6966] font-mono">{fmtTime(a.check_out_time)}</div>
                          <div className="text-[10px] text-[#9b9895]">{fmtDate(a.check_out_time)}</div>
                        </>
                      ) : (
                        <span className="text-[#c9c7c3]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isCheckedIn ? (
                        <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-medium">Inside</span>
                      ) : (
                        <span className="text-[11px] text-[#9b9895]">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />}
      </div>
    </div>
  );
}
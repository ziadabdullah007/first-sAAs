import { useState, useEffect, useRef } from "react";
import { ATTENDANCE, MEMBERS } from "../data/fixtures";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";
import { IconSearch, IconCheck } from "../components/ui/Icons";
import { statusBadge } from "../components/ui/Badge";

type CheckedIn = { memberId: string; name: string; time: string };

export default function AttendancePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("2025-08-15");
  const [checkedIn, setCheckedIn] = useState<CheckedIn | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const searchResults = search.trim().length >= 2
    ? MEMBERS.filter(m => {
        const q = search.toLowerCase();
        return `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) || m.phone.includes(q);
      }).slice(0, 6)
    : [];

  const handleCheckIn = (memberId: string) => {
    const m = MEMBERS.find(mb => mb.id === memberId);
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setCheckedIn({ memberId, name: `${m?.firstName} ${m?.lastName}`, time });
    setSearch("");
    toast(`${m?.firstName} ${m?.lastName} checked in at ${time}.`);
    setTimeout(() => { setCheckedIn(null); inputRef.current?.focus(); }, 4000);
  };

  const todayRecords = ATTENDANCE.filter(a => a.date === dateFilter);
  const currentlyIn = ATTENDANCE.filter(a => a.date === "2025-08-15" && !a.checkOut);

  return (
    <div className="p-6 max-w-[1300px] space-y-5">
      <div>
        <h1 className="text-[15px] font-semibold text-[#111110]">Attendance</h1>
        <p className="text-xs text-[#9b9895] mt-0.5">Check in and track member attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Check-in + currently in */}
        <div className="space-y-3">
          {/* Check-in panel */}
          <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e5e3e0] bg-[#fafaf9]">
              <div className="text-[12px] font-semibold text-[#111110]">Quick Check-In</div>
              <div className="text-[11px] text-[#9b9895] mt-0.5">Search by name or phone number</div>
            </div>
            <div className="p-4">
              {checkedIn ? (
                <div className="py-3 text-center">
                  <div className="w-12 h-12 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconCheck size={20} className="text-green-600" />
                  </div>
                  <div className="text-[15px] font-semibold text-[#111110]">{checkedIn.name}</div>
                  <div className="text-[12px] text-green-600 font-medium mt-1">Checked in at {checkedIn.time}</div>
                  <div className="text-[11px] text-[#9b9895] mt-0.5">Access granted</div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9b9895]">
                      <IconSearch size={14} />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Member name or phone..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full h-9 text-sm border border-[#e5e3e0] rounded-md bg-white pl-9 pr-3 text-[#111110] placeholder:text-[#9b9895] outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-[#e5e3e0] rounded-lg shadow-lg z-10 mt-1 overflow-hidden">
                      {searchResults.map(m => (
                        <button
                          key={m.id}
                          onClick={() => handleCheckIn(m.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f5f4f2] transition-colors text-left border-b border-[#f0efed] last:border-0"
                        >
                          <Avatar initials={m.avatarInitials} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#111110]">{m.firstName} {m.lastName}</div>
                            <div className="text-[11px] text-[#9b9895] font-mono">{m.phone}</div>
                          </div>
                          {statusBadge(m.status)}
                        </button>
                      ))}
                    </div>
                  )}
                  {search.trim().length >= 2 && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-[#e5e3e0] rounded-md shadow-sm z-10 mt-1 px-3 py-3 text-[12px] text-[#9b9895]">
                      No members found for "{search}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#e5e3e0] rounded-lg px-3 py-2.5 text-center">
              <div className="text-xl font-bold text-[#111110] tabular-nums">{todayRecords.length}</div>
              <div className="text-[11px] text-[#9b9895]">Today's check-ins</div>
            </div>
            <div className="bg-white border border-[#e5e3e0] rounded-lg px-3 py-2.5 text-center">
              <div className="text-xl font-bold text-green-700 tabular-nums">{currentlyIn.length}</div>
              <div className="text-[11px] text-[#9b9895]">Currently in gym</div>
            </div>
          </div>

          {/* Currently in gym */}
          <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
              <div className="text-[12px] font-semibold text-[#111110]">Currently In Gym</div>
              {currentlyIn.length > 0 && (
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                  {currentlyIn.length}
                </span>
              )}
            </div>
            {currentlyIn.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12px] text-[#9b9895]">No active visits right now.</div>
            ) : (
              <div className="divide-y divide-[#f5f4f2]">
                {currentlyIn.map(a => {
                  const m = MEMBERS.find(mb => mb.id === a.memberId);
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                      <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-[#111110]">{a.memberName}</div>
                        <div className="text-[11px] text-[#9b9895]">Since {a.checkIn}</div>
                      </div>
                      <button className="text-[11px] text-[#6b6966] hover:text-[#111110] border border-[#e5e3e0] px-2 py-0.5 rounded hover:bg-[#f5f4f2] transition-colors">
                        Check out
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Attendance log */}
        <div className="lg:col-span-2 bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
            <div className="text-[12px] font-semibold text-[#111110]">Attendance Log</div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9b9895]">{todayRecords.length} entries</span>
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="h-7 text-xs border border-[#e5e3e0] rounded-md px-2.5 outline-none focus:border-[#1d4ed8] bg-white text-[#111110] cursor-pointer"
              />
            </div>
          </div>
          {todayRecords.length === 0 ? (
            <EmptyState title="No attendance records" description={`No check-ins recorded for ${dateFilter}.`} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Member</th>
                  <th className="text-left px-4 py-2.5">Check-in</th>
                  <th className="text-left px-4 py-2.5">Check-out</th>
                  <th className="text-left px-4 py-2.5">Duration</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f4f2]">
                {todayRecords.map(a => {
                  const dur = a.checkOut
                    ? (() => { const m = Math.round((new Date(`2000-01-01 ${a.checkOut}`).getTime() - new Date(`2000-01-01 ${a.checkIn}`).getTime()) / 60000); return `${Math.floor(m/60)}h ${m%60}m`; })()
                    : null;
                  const mb = MEMBERS.find(m => m.id === a.memberId);
                  return (
                    <tr key={a.id} className="hover:bg-[#fafaf9] transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={mb?.avatarInitials ?? "??"} size="sm" />
                          <span className="text-[13px] font-medium text-[#111110]">{a.memberName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[12px] font-mono text-[#111110]">{a.checkIn}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono text-[#6b6966]">{a.checkOut ?? <span className="text-green-600">—</span>}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{dur ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        {!a.checkOut
                          ? <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">Active</span>
                          : <span className="text-[11px] text-[#9b9895]">Done</span>
                        }
                      </td>
                      <td className="px-4 py-2.5">
                        {!a.checkOut && (
                          <button className="text-[11px] text-[#6b6966] hover:text-[#111110] hover:underline">Check out</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

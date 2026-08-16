import { type SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const mk = (children: React.ReactNode) =>
  function Icon({ size = 16, className = "", ...p }: P) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...p}>
        {children}
      </svg>
    );
  };

export const IconDashboard = mk(<path d="M2 6.5L8 2l6 4.5V14H10v-4H6v4H2V6.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/>);
export const IconMembers = mk(<><circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.35"/><path d="M1.5 13.5C1.5 11 3.8 9 6.5 9s5 2 5 4.5M11 5.5c1.5 0 2.5 1 2.5 2.5M13.5 8C14.8 8.5 15.5 9.5 15.5 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconAttendance = mk(<><rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.35"/><path d="M6 6h4M6 9h3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconSubscriptions = mk(<><rect x="1.5" y="4.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.35"/><path d="M1.5 7.5h13M5 4.5V3M11 4.5V3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconPlans = mk(<><path d="M2 3h12M2 7h9M2 11h7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconPayments = mk(<><rect x="1.5" y="4" width="13" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.35"/><path d="M1.5 7.5h13" stroke="currentColor" strokeWidth="1.35"/></>);
export const IconMeasurements = mk(<><path d="M3 13V8M6 13V4M9 13V7M12 13V3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconGymProfile = mk(<path d="M2.5 13.5V7.5l5.5-5 5.5 5v6H10V10H6v3.5H2.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/>);
export const IconStaff = mk(<><circle cx="7" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.35"/><path d="M1.5 13.5C1.5 11 4 9 7 9M11.5 10v4M13.5 12h-4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconGyms = mk(<path d="M1.5 14V8L8 2.5 14.5 8v6H10.5V11h-5v3H1.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/>);
export const IconUsers = mk(<><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.35"/><path d="M1 13.5C1 11 3.2 9 6 9s5 2 5 4.5M10.5 4.5a2.5 2.5 0 010 5M14 13.5c0-2-1.3-3.6-3-4.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconSaaS = mk(<><path d="M8 2l1.8 3.7 4.2.6-3 3 .7 4.2L8 11.5 4.3 13.5 5 9.3 2 6.3l4-.6L8 2z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/></>);
export const IconSettings = mk(<><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.35"/><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M12.8 3.2l-1.3 1.3M4.5 11.5l-1.3 1.3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconChevronLeft = mk(<path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconChevronRight = mk(<path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconChevronDown = mk(<path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconSearch = mk(<><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M11.5 11.5l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>);
export const IconPlus = mk(<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>);
export const IconClose = mk(<path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>);
export const IconCheck = mk(<path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconBell = mk(<><path d="M8 2.5A4 4 0 004 6.5v3L2.5 11h11L12 9.5v-3A4 4 0 008 2.5z" stroke="currentColor" strokeWidth="1.35"/><path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconFilter = mk(<path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>);
export const IconSort = mk(<path d="M4 6l3-3 3 3M10 10l-3 3-3-3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconSortAsc = mk(<><path d="M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9h8M4 12h5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconSortDesc = mk(<><path d="M4 11l3 3 3-3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4h8M4 7h5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconWarning = mk(<><path d="M8 2.5L14 13H2L8 2.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="M8 6.5v3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="currentColor"/></>);
export const IconInfo = mk(<><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.35"/><path d="M8 7.5V11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/><circle cx="8" cy="5.5" r="0.75" fill="currentColor"/></>);
export const IconSuccess = mk(<><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.35"/><path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></>);
export const IconError = mk(<><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.35"/><path d="M8 5.5V9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/><circle cx="8" cy="11" r="0.75" fill="currentColor"/></>);
export const IconMoreH = mk(<><circle cx="4" cy="8" r="1.25" fill="currentColor"/><circle cx="8" cy="8" r="1.25" fill="currentColor"/><circle cx="12" cy="8" r="1.25" fill="currentColor"/></>);
export const IconExternal = mk(<><path d="M7 3H3.5A1.5 1.5 0 002 4.5v8A1.5 1.5 0 003.5 14h8A1.5 1.5 0 0013 12.5V9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/><path d="M9 2.5h4.5V7M13.5 2.5L8 8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></>);
export const IconLogOut = mk(<><path d="M6 2.5H3.5A1.5 1.5 0 002 4v8a1.5 1.5 0 001.5 1.5H6M10.5 11L14 8l-3.5-3M6.5 8H14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></>);
export const IconTrend = mk(<path d="M1.5 12.5l4-5 3 2.5 4-6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>);
export const IconCalendar = mk(<><rect x="2" y="3.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.35"/><path d="M2 7.5h12M5.5 2.5v2M10.5 2.5v2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);
export const IconEye = mk(<><path d="M1.5 8S4 4 8 4s6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4z" stroke="currentColor" strokeWidth="1.35"/><circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.35"/></>);
export const IconLock = mk(<><rect x="3.5" y="7.5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.35"/><path d="M5.5 7.5V5a2.5 2.5 0 015 0v2.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/></>);

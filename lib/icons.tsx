interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

const base = (size: number, children: React.ReactNode, props: Partial<IconProps> = {}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color ?? 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    {children}
  </svg>
);

export function IconHome({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>, p);
}

export function IconHistory({ size = 16, ...p }: IconProps) {
  return base(size, <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, p);
}

export function IconSwitch({ size = 16, ...p }: IconProps) {
  return base(size, <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></>, p);
}

export function IconLogout({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>, p);
}

export function IconUsers({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>, p);
}

export function IconUser({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>, p);
}

export function IconSeat({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>, p);
}

export function IconTrash({ size = 14, ...p }: IconProps) {
  return base(size, <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></>, p);
}

export function IconSave({ size = 14, ...p }: IconProps) {
  return base(size, <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>, p);
}

export function IconLock({ size = 16, ...p }: IconProps) {
  return base(size, <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>, p);
}

export function IconEmail({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, p);
}

export function IconEye({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>, p);
}

export function IconEyeOff({ size = 16, ...p }: IconProps) {
  return base(size, <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>, p);
}

export function IconMonitor({ size = 40, ...p }: IconProps) {
  return base(size, <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>, p);
}

export function IconAdminGear({ size = 40, ...p }: IconProps) {
  return base(size, <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="19" r="3"/><path d="M19 16v1m0 4v1m-2.6-4.4.7.7m3.8 3.8.7.7M16 19h-1m8 0h-1m-1.4-2.6.7-.7m-3.8 3.8.7-.7"/></>, p);
}

export function IconAward({ size = 24, ...p }: IconProps) {
  return base(size, <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>, p);
}

export function IconXCircle({ size = 24, ...p }: IconProps) {
  return base(size, <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>, p);
}

export function IconX({ size = 28, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={p.color ?? 'white'} strokeWidth="2.5" strokeLinecap="round" className={p.className}>
      <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
    </svg>
  );
}

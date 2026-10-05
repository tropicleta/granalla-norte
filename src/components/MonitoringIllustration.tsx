export function MonitoringIllustration({ sensor = false }: { sensor?: boolean }) {
  return <svg viewBox="0 0 400 220" className="h-full w-full" fill="none" aria-hidden="true">
    <path d="M25 183h350" stroke="#b6b66e" strokeOpacity=".3" />
    {!sensor && <g stroke="#e1d8c8" strokeWidth="3" strokeLinejoin="round"><path d="m46 74 124-12 28 94-132 12z" fill="#c8672a" /><path d="m69 88 79-8 9 34-79 8z" fill="#22231a" /><path d="m84 104 9-3 7 6 7-17 9 20 8-8 12-1" stroke="#b6b66e" strokeWidth="2" /><circle cx="97" cy="140" r="5" /><circle cx="119" cy="138" r="5" /><circle cx="141" cy="136" r="5" /><path d="M191 139c30-80 55-37 64-19" /></g>}
    <g stroke="#e1d8c8" strokeWidth="3" strokeLinejoin="round" transform={sensor ? "translate(-75 0)" : undefined}><path d="m244 128 56-24 54 24-55 27z" fill="#b6b66e" /><path d="M244 128v35l55 22 55-22v-35l-55 27z" fill="#515137" /><path d="M299 155v30M299 80v-28M289 63l10-11 10 11M348 90l23-16M359 73l12 1-2 12" stroke="#c8672a" /><path d="m275 80-21-16m0 12V64h12" stroke="#c8672a" /></g>
  </svg>;
}

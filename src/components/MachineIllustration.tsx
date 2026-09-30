export function MachineIllustration({ type }: { type: string }) {
  const truck = type.startsWith("Camión");
  return <svg viewBox="0 0 320 180" className="h-full w-full" fill="none" aria-hidden="true">
    <path d="M20 153h280" stroke="#b6b66e" strokeOpacity=".3" strokeWidth="2" />
    <g stroke="#e1d8c8" strokeWidth="3" strokeLinejoin="round">
      {truck ? <>
        {type === "Camión aljibe" ? <rect x="45" y="61" width="145" height="60" rx="26" fill="#515137" /> : <path d="M40 57h155l-12 64H54z" fill="#515137" />}
        <path d="M196 83h47l35 34v18h-82z" fill="#c8672a" /><path d="M205 91h31l22 23h-53z" fill="#22231a" />
        <path d="M43 134h237" /><circle cx="76" cy="137" r="16" fill="#22231a" /><circle cx="158" cy="137" r="16" fill="#22231a" /><circle cx="250" cy="137" r="16" fill="#22231a" />
      </> : <>
        <path d="M65 96h126v37H65zM102 51h53v45h-53z" fill="#c8672a" /><path d="M112 60h33v29h-33z" fill="#22231a" />
        <path d="m186 99 37-64 54 76" stroke="#b6b66e" strokeWidth="9" /><path d="m263 105 29 9-8 27-34-11z" fill="#515137" />
        {type === "Rodillo compactador" ? <><circle cx="83" cy="137" r="18" fill="#22231a" /><rect x="143" y="120" width="57" height="33" rx="10" fill="#7a7a4c" /></> : <rect x="54" y="132" width="150" height="22" rx="11" fill="#22231a" />}
      </>}
    </g>
  </svg>;
}

import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "../shell";
import s from "../content.module.css";
export const metadata: Metadata = { title: "Página web", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/sitio"><main className={s.workspace}><div className={s.heading}><div><h1>Tu página web</h1><p>Actualiza lo que ven las personas que visitan Granalla Norte.</p></div><Link href="/" target="_blank" className={s.button}>Ver página pública</Link></div><div className={s.messages}>{[["/admin/noticias", "Noticias y proyectos publicados", "Crea noticias, guarda borradores y revisa la vista previa antes de publicar."], ["/admin/maquinaria", "Maquinaria", "Actualiza los equipos, fotografías y disponibilidad que se muestran en la página."], ["/admin/equipos-monitoreo", "Equipos de monitoreo", "Gestiona los sismógrafos y geófonos publicados."]].map(([href, title, description]) => <section className={s.message} key={href}><h2>{title}</h2><p className={`${s.muted} my-4`}>{description}</p><Link href={href} className={s.primary}>Administrar</Link></section>)}</div></main></AdminShell>; }

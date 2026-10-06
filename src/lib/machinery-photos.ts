// References for catalog photography. Matching by image path keeps uploaded
// replacement photos from inheriting a reference label or an external credit.
export const machineryPhotoReferences: Record<string, { label: string; source: string; credit: string; fit: "contain" | "cover" }> = {
  "/img/motoniveladora-rg200b-referencial.jpg": {
    label: "RG200.B EVO",
    source: "https://www.skc.cl/newhollandconstruction/detalle/motoniveladora/14019",
    credit: "SKC / New Holland",
    fit: "contain",
  },
  "/img/excavadora-dx210-referencial.jpg": {
    label: "DX210W",
    source: "https://www.agriexpo.online/prod/doosan-infracore-co-ltd/product-179004-150507.html",
    credit: "Doosan / AgriExpo",
    fit: "contain",
  },
  "/img/aljibe-jac-referencial.jpg": {
    label: "aljibe JAC",
    source: "https://www.camionesjac.cl/productos/gama-runner/camion-runner-1137-aljibe",
    credit: "JAC Motors / DercoMaq",
    fit: "contain",
  },
  "/img/tolva-jac-3262-referencial.jpg": {
    label: "JAC 3262",
    source: "https://www.camionesjac.cl/productos/camiones-pesados/camion-jac-tolva-3262-ano-2022-rt-25",
    credit: "JAC Motors / DercoMaq",
    fit: "cover",
  },
};

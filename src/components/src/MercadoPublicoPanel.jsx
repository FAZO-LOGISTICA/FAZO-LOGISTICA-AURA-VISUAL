// MercadoPublicoPanel.jsx
// Ubicación: src/components/MercadoPublicoPanel.jsx

import { useState } from "react";

const ESTADO_COLORS = {
  publicada:  { bg: "#0f3d2e", text: "#4ade80", dot: "#4ade80" },
  adjudicada: { bg: "#1e3a5f", text: "#60a5fa", dot: "#60a5fa" },
  cerrada:    { bg: "#3b1f1f", text: "#f87171", dot: "#f87171" },
  desierta:   { bg: "#2d2a1e", text: "#fbbf24", dot: "#fbbf24" },
};

function formatFecha(fechaStr) {
  if (!fechaStr) return null;
  try {
    return new Date(fechaStr).toLocaleDateString("es-CL", {
      day: "2-digit", month: "short", year: "numeric"
    });
  } catch {
    return fechaStr;
  }
}

function formatMonto(monto) {
  if (!monto) return null;
  return `$${Number(monto).toLocaleString("es-CL")}`;
}

export default function MercadoPublicoPanel({
  resultados = [],
  query = "",
  tipo = "licitacion",
  loading = false,
}) {
  const [expandido, setExpandido] = useState(null);

  const esConvenio  = tipo === "convenio-marco";
  const tituloPanel = esConvenio ? "Convenio Marco" : "Licitaciones";

  if (loading) {
    return (
      <div style={s.container}>
        <div style={s.header}>
          <span style={s.headerIcon}>🏛️</span>
          <div style={s.headerInfo}>
            <span style={s.headerTitle}>{tituloPanel}</span>
            <span style={s.headerQuery}>Buscando "{query}"...</span>
          </div>
          <div style={s.spinner} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={s.skeleton} />
        ))}
      </div>
    );
  }

  if (!resultados.length) return null;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={s.headerIcon}>🏛️</span>
        <div style={s.headerInfo}>
          <span style={s.headerTitle}>{tituloPanel} · Mercado Público</span>
          <span style={s.headerQuery}>"{query}"</span>
        </div>
        <span style={s.badge}>{resultados.length} resultados</span>
      </div>

      <div style={s.list}>
        {resultados.map((item, i) => {
          const estadoKey   = (item.estado || "publicada").toLowerCase();
          const estadoStyle = ESTADO_COLORS[estadoKey] || ESTADO_COLORS.publicada;
          const isOpen      = expandido === i;
          const subtitulo   = esConvenio ? item.proveedor : item.organismo;

          return (
            <div
              key={item.codigo || i}
              style={{ ...s.card, ...(isOpen ? s.cardOpen : {}) }}
              onClick={() => setExpandido(isOpen ? null : i)}
            >
              <div style={s.cardTop}>
                <div style={s.cardTopLeft}>
                  <span style={{ ...s.estadoBadge, background: estadoStyle.bg, color: estadoStyle.text }}>
                    <span style={{ ...s.dot, background: estadoStyle.dot }} />
                    {item.estado || item.convenio || "—"}
                  </span>
                  {item.codigo && <span style={s.codigo}>{item.codigo}</span>}
                </div>
                <span style={s.chevron}>{isOpen ? "▲" : "▼"}</span>
              </div>

              <p style={s.nombre}>{item.nombre || "Sin nombre"}</p>
              {subtitulo && <p style={s.subtitulo}>{subtitulo}</p>}

              {isOpen && (
                <div style={s.detalle}>
                  {item.fechaCierre && (
                    <div style={s.detalleRow}>
                      <span style={s.detalleLabel}>Cierre</span>
                      <span style={s.detalleValor}>{formatFecha(item.fechaCierre)}</span>
                    </div>
                  )}
                  {item.monto && (
                    <div style={s.detalleRow}>
                      <span style={s.detalleLabel}>Monto estimado</span>
                      <span style={s.detalleValor}>{formatMonto(item.monto)}</span>
                    </div>
                  )}
                  {item.precio && (
                    <div style={s.detalleRow}>
                      <span style={s.detalleLabel}>Precio neto</span>
                      <span style={s.detalleValor}>
                        {formatMonto(item.precio)}{item.unidad ? ` / ${item.unidad}` : ""}
                      </span>
                    </div>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={s.verLink}
                      onClick={e => e.stopPropagation()}
                    >
                      Ver en Mercado Público →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={s.footer}>Fuente: api.mercadopublico.cl · Clic en cada resultado para ver detalles</p>
    </div>
  );
}

const s = {
  container: {
    background: "#0d1117",
    border: "1px solid #1e2d3d",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Courier New', monospace",
  },
  header: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 12, borderBottom: "1px solid #1e2d3d", paddingBottom: 10,
  },
  headerIcon: { fontSize: 18, flexShrink: 0 },
  headerInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  headerTitle: { color: "#e6edf3", fontWeight: "bold", fontSize: 13 },
  headerQuery: { color: "#4d8eb5", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  badge: {
    background: "#1e2d3d", color: "#4d8eb5", fontSize: 11,
    padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
  },
  list: { display: "flex", flexDirection: "column", gap: 6 },
  card: {
    background: "#161b22", border: "1px solid #1e2d3d",
    borderRadius: 8, padding: "10px 12px", cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  cardOpen: { borderColor: "#4d8eb5", background: "#192230" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  cardTopLeft: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  estadoBadge: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 10, fontWeight: "bold", padding: "2px 8px",
    borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
  },
  dot: { width: 5, height: 5, borderRadius: "50%", flexShrink: 0 },
  codigo: { color: "#4d8eb5", fontSize: 10, opacity: 0.8 },
  chevron: { color: "#4d5662", fontSize: 10, flexShrink: 0 },
  nombre: {
    color: "#c9d1d9", fontSize: 12, margin: "0 0 2px 0", lineHeight: 1.5,
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  subtitulo: { color: "#4d5662", fontSize: 11, margin: 0 },
  detalle: {
    marginTop: 10, borderTop: "1px solid #1e2d3d",
    paddingTop: 10, display: "flex", flexDirection: "column", gap: 7,
  },
  detalleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  detalleLabel: { color: "#4d5662", fontSize: 11, flexShrink: 0 },
  detalleValor: { color: "#e6edf3", fontSize: 12, textAlign: "right" },
  verLink: { color: "#4d8eb5", fontSize: 12, textDecoration: "none", marginTop: 2, display: "inline-block" },
  footer: { color: "#2d3748", fontSize: 10, textAlign: "center", marginTop: 10, marginBottom: 0 },
  spinner: {
    width: 14, height: 14, border: "2px solid #1e2d3d",
    borderTop: "2px solid #4d8eb5", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", flexShrink: 0,
  },
  skeleton: {
    height: 64, background: "#161b22", borderRadius: 8,
    marginBottom: 6, border: "1px solid #1e2d3d",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

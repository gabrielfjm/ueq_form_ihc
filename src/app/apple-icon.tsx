import { ImageResponse } from "next/og";

// Ícone da tela inicial do celular (iOS não usa SVG). Mesmo desenho do icon.svg: a fileira de marcações do
// diferencial semântico, com a última marcada, sobre o azul-petróleo (docs/design.md, A ideia)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const DESTAQUE = "#0B6A78";
const FUNDO = "#FFFFFF";

export default function IconeApple() {
  const vazio = { width: 42, height: 42, borderRadius: 21, border: `8px solid ${FUNDO}`, background: DESTAQUE };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: DESTAQUE,
        }}
      >
        <div style={vazio} />
        <div style={vazio} />
        <div style={{ width: 50, height: 50, borderRadius: 25, background: FUNDO }} />
      </div>
    ),
    size,
  );
}

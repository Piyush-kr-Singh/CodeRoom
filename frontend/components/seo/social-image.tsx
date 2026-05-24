type SocialImageProps = {
  eyebrow: string;
  title: string;
  description: string;
  accentLabel?: string;
};

export const socialImageSize = {
  width: 1200,
  height: 630
} as const;

export const socialImageContentType = "image/png";

export function SocialImage({
  eyebrow,
  title,
  description,
  accentLabel = "codesyncup.com"
}: SocialImageProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background:
          "radial-gradient(circle at 12% 18%, rgba(79, 209, 197, 0.28), transparent 26%), radial-gradient(circle at 86% 12%, rgba(255, 155, 113, 0.22), transparent 22%), radial-gradient(circle at 50% 100%, rgba(248, 214, 109, 0.18), transparent 28%), linear-gradient(135deg, #081018 0%, #0d1722 42%, #132334 100%)",
        color: "#dce8f5",
        padding: "56px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          border: "1px solid rgba(163, 188, 214, 0.22)",
          borderRadius: "36px",
          padding: "44px",
          background: "rgba(8, 16, 24, 0.6)",
          boxShadow: "0 20px 70px rgba(0, 0, 0, 0.24)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#4fd1c5"
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                border: "1px solid rgba(248, 214, 109, 0.34)",
                color: "#f8d66d",
                padding: "12px 20px",
                fontSize: 24
              }}
            >
              {accentLabel}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                fontSize: 68,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                maxWidth: "940px"
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                color: "#b7c9dc",
                maxWidth: "910px"
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>CodeSyncUp</div>
              <div style={{ display: "flex", fontSize: 24, color: "#8ba0b9" }}>
                Anonymous real-time code sharing with expiring private rooms
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: 108,
                height: 108,
                borderRadius: "28px",
                background: "linear-gradient(135deg, #4fd1c5 0%, #7be4da 100%)",
                color: "#05232a",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                fontWeight: 800
              }}
            >
              {"</>"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

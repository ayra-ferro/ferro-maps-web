/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        // Primitive brand tokens
        "ferro-primary": "#1E7BFF",
        "ferro-deep": "#0A4FCC",
        "ferro-sky": "#5BA8FF",
        "ferro-tint": "#E8F1FF",
        "ferro-ink": "#000000",
        "ferro-signal": "#FFB72E",

        // Primitive neutral tokens
        "neutral-50": "#F7F9FC",
        "neutral-100": "#EEF2F8",
        "neutral-200": "#DDE4EF",
        "neutral-300": "#C2CDDC",
        "neutral-500": "#6B7892",
        "neutral-700": "#3A4358",
        "neutral-900": "#0F1626",

        // Primitive utility tokens
        "color-white": "#FFFFFF",
        "color-success": "#1FA971",
        "color-warning": "#FFB72E",
        "color-danger": "#E5364A",

        // Semantic surface tokens
        "surface-canvas": "#FFFFFF",
        "surface-raised": "#F7F9FC",
        "surface-overlay": "#FFFFFF",
        "surface-sunken": "#EEF2F8",
        "surface-inverse": "#0F1626",
        "surface-brand-subtle": "#E8F1FF",
        "surface-brand": "#1E7BFF",

        // Semantic text tokens
        "text-primary": "#0F1626",
        "text-secondary": "#3A4358",
        "text-tertiary": "#6B7892",
        "text-disabled": "#C2CDDC",
        "text-inverse": "#FFFFFF",
        "text-brand": "#1E7BFF",
        "text-on-brand": "#FFFFFF",

        // Semantic border tokens
        "border-subtle": "#EEF2F8",
        "border-default": "#DDE4EF",
        "border-strong": "#C2CDDC",
        "border-brand": "#1E7BFF",

        // Semantic action tokens
        "action-primary": "#1E7BFF",
        "action-primary-hover": "#0A4FCC",
        "action-primary-pressed": "#0A4FCC",
        "action-primary-disabled": "#C2CDDC",
        "action-secondary": "#E8F1FF",
        "action-secondary-hover": "#D6E5FF",
        "action-ghost-hover": "#EEF2F8",

        // Status tokens
        "status-success": "#1FA971",
        "status-warning": "#FFB72E",
        "status-danger": "#E5364A",
        "status-info": "#1E7BFF",

        // Map-specific tokens
        "map-pin-default": "#1E7BFF",
        "map-pin-selected": "#0A4FCC",
        "map-route-active": "#1E7BFF",
        "map-route-alternate": "#C2CDDC",
        "map-user-location": "#1E7BFF",

        // Tier tokens
        "tier-good": "#5BA8FF",
        "tier-great": "#1E7BFF",
        "tier-flawless": "#FFB72E",
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.05" }],
        headline: ["32px", { lineHeight: "1.15" }],
        title: ["24px", { lineHeight: "1.25" }],
        subtitle: ["18px", { lineHeight: "1.35" }],
        "body-lg": ["17px", { lineHeight: "1.45" }],
        body: ["15px", { lineHeight: "1.5" }],
        "body-sm": ["13px", { lineHeight: "1.45" }],
        label: ["14px", { lineHeight: "1.2" }],
        caption: ["12px", { lineHeight: "1.35" }],
        overline: ["11px", { lineHeight: "1.3" }],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
        button: "8px",
        card: "12px",
        sheet: "16px",
      },
      boxShadow: {
        "elevation-0": "none",
        "elevation-1": "0 1px 2px rgba(15,22,38,0.06)",
        "elevation-2": "0 4px 8px rgba(15,22,38,0.08)",
        "elevation-3": "0 8px 24px rgba(15,22,38,0.12)",
        "elevation-4": "0 16px 40px rgba(15,22,38,0.16)",
        "elevation-focus": "0 0 0 3px rgba(30,123,255,0.32)",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
        "space-inset-xs": "8px",
        "space-inset-sm": "12px",
        "space-inset-md": "16px",
        "space-inset-lg": "24px",
        "space-inset-xl": "32px",
        "space-stack-xs": "4px",
        "space-stack-sm": "8px",
        "space-stack-md": "16px",
        "space-stack-lg": "24px",
        "space-stack-xl": "40px",
        "space-inline-xs": "4px",
        "space-inline-sm": "8px",
        "space-inline-md": "12px",
        "touch-target-min": "44px",
        "touch-target-comfortable": "48px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        decelerate: "cubic-bezier(0, 0, 0, 1)",
        accelerate: "cubic-bezier(0.3, 0, 1, 1)",
        emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "160ms",
        base: "240ms",
        slow: "360ms",
        deliberate: "560ms",
      },
    },
  },
  plugins: [],
}

import { useState } from "react";

function fallbackFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🌍";
  return String.fromCodePoint(
    ...code.split("").map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65)),
  );
}

export type CountryFlagProps = {
  code: string;
  alt?: string;
  className?: string;
};

export function CountryFlag({ code, alt, className }: CountryFlagProps) {
  const [failed, setFailed] = useState(false);
  const normalized = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized) || failed) {
    return <span className={className}>{fallbackFlagEmoji(normalized)}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${normalized.toLowerCase()}.png`}
      alt={alt ?? normalized}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

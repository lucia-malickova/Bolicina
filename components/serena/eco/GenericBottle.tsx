/** A plain bottle silhouette for other (anonymous) producers. */
export default function GenericBottle({ letter, size = 96, rose = false }: { letter: string; size?: number; rose?: boolean }) {
  return (
    <svg viewBox="0 0 40 120" style={{ height: size, width: size / 3 }} aria-hidden>
      <path
        d="M16 2h8v26c0 6 8 10 8 22v62a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V50c0-12 8-16 8-22z"
        fill={rose ? "#3a2226" : "#1f2a22"}
        stroke="rgba(232,214,168,.25)"
        strokeWidth="0.8"
      />
      <rect x="15" y="2" width="10" height="16" rx="1.5" fill="#6b6457" />
      <rect x="10" y="66" width="20" height="26" rx="2" fill="#d9d2c3" />
      <text x="20" y="84" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#3a3a3a">
        {letter}
      </text>
    </svg>
  );
}

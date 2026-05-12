export default function CredentialChip({ label }: { label: string }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium tracking-wide"
      style={{
        backgroundColor: "var(--mint-light)",
        color: "var(--mint-dark)",
        border: "1px solid var(--border-mint)",
      }}
    >
      {label}
    </span>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path className="logo__arc" d="M44 20.5A16 16 0 1 0 48 32" />
        <path className="logo__arrow" d="M40 29l8-10 8 10z" />
        <circle className="logo__dot" cx="32" cy="32" r="4.5" />
      </svg>
      <span className="logo__text">RetoLoop</span>
    </span>
  );
}

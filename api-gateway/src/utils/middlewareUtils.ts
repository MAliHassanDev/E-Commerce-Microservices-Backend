
export function getStatusColorCode(status: number) {
  return status >= 500 ? 31 // green
    : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
          : 0; // no color
}

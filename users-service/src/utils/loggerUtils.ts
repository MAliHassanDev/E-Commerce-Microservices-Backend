
export default function getTimeStamp(format: string = "dd-MM-YYYY hh:mm:ss"): string {
  // const inValidFormatRegex = /[^dDmMyYhs\-:\s]/;
  // if (inValidFormatRegex.test(format)) return null;
  const pad2Digit = (num: number): string  => num < 10 ? num.toString().padStart(2,'0') : num.toString();
  const twelveHourFormat = (hour: number) => hour > 12 ? hour % 12 : hour;
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = twelveHourFormat(date.getHours());
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formatMap = {
    dd: pad2Digit(day),
    d: `${day}`,
    MM: pad2Digit(month),
    M: `${month}`,
    YYYY: year,
    hh: pad2Digit(hour),
    h: `${hour}`,
    mm: pad2Digit(minutes),
    m: `${minutes}`,
    ss: pad2Digit(seconds),
    s: `${seconds}`,
  };
  return format.replace(/(?:dd|d|YYYY|MM|M|hh|h|mm|m|ss|s)+/g, (match) => formatMap[match]);
}
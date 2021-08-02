export const toDBFS = (buffer: Array<number>) => {
  var len = buffer.length,
    total = 0,
    i = 0,
    rms,
    db;

  while (i < len) {
    total += buffer[i] * buffer[i++];
  }

  rms = Math.sqrt(total / len);
  db = 20 * (Math.log(rms) / Math.LN10);
  return Math.max(-192, db);
};
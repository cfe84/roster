
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export class base64 {
  static btoa(input: string) {
    var str = String(input);
    let output: string = "";
    for (
      let block: number = 0, charCode, idx = 0, map = chars;
      str.charAt(idx | 0) || (map = '=', idx % 1);
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3 / 4);
      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  }

  static atob(input: string) {
    var str = (String(input)).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      var bc = 0, bs = 0, buffer, idx = 0, output = '';
      buffer = str.charAt(idx++); // eslint-disable-line no-cond-assign
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
    return output;
  }
}
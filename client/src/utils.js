String.prototype.titleCase = function() {
  var words = this.valueOf().toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }
  return words.join(' ');
}

function getPrefix(filename) {
  const separators = ["_sw", "_s", "_p", "_m", "_cc", "_oc"];
  const chromoscope = ["BOCA", "BRCA", "BTCA", "GBM", "LIRI", "PBCA"];
  const chromoscope2 = ["breast-", "gastric", "kidney", "ovarian serous cystadenocarcinoma", "ovarian", "prostate adenocarcinoma", "sarcoma"];

  // for chromoscope
  if (chromoscope.some(chromo => filename.includes(chromo))) {
      return filename.split("-").slice(0, 2).join("-");
  }

  if (chromoscope2.some(chromo2 => filename.includes(chromo2))) {
      return filename.split("-")[0];
  }

  // for others
  let minIndex = filename.length;
  for (const sep of separators) {
      const index = filename.indexOf(sep);
      if (index !== -1 && index < minIndex) {
          minIndex = index;
      }
  }
  return filename.slice(0, minIndex);
}

export function prettierName(filename) {
  const prefix = getPrefix(filename);
  const title = prefix.replaceAll('-', ' ').replaceAll('_', ' ').replaceAll("EX SPEC ", "").titleCase()
  return title;
}
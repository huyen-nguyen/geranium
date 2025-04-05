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
    const nameChange= {
        'Text': 'Sequence Logo',
        'Sars Cov 2': 'SARS-CoV-2',
        'Hic': 'Hi-C Contact Matrix',
        'Matrix': 'Hi-C Contact Matrix',
        'Sequence Track': 'Genome Semantic Zooming',
        'Matrix Hffc6': 'HFFc6 Comparative Matrix',
        'Mouse Event': 'Custom Mouse Event',
        'Circulr Range': 'Circular Range',
        'Stratified Bar Alt': 'Stratified Bar Chart',
        'Line': 'Line Chart',
        'Circular Point First': 'Stratified Circular Point Chart',
        'Overview Landing': 'Linear Layout Combination',
        'Vcf Indels': 'VCF Indels',
        'Bed Demo': 'BED6 and BED12 Demo',
        'Circulars': 'Circular Layout Combination',
        'Boca Uk': 'Breast Cancer Variants',
        'Single Cell Epi Corces': 'Single-cell Epigenomic Analysis',
        'Brush': 'Brushing and Linking',
        'gray_heatmap': 'Hi-C Matrix',
        'Cancer Variant Prototype': 'Cancer Variant + Pileup',
        'Viridis Heatmap': 'Heatmap',
        'Pileup': 'BAM Pileup Track',
        'Circular Overview Linear Detail': 'Overview and Detail',
        'Circular Heat': 'Circular Heatmap',
    }
    const prefix = getPrefix(filename);
    const basicTitle = prefix
        .replace(/[-_]/g, ' ')
        .replace(/EX SPEC /g, '')
        .titleCase();

    return nameChange[basicTitle] || basicTitle;
}
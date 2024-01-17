export function extractColumnTitles (csv: string[][], columnsHaveTitles: boolean): {
  columnTitles: string[]
  csv: string[][]
} {
  let columnTitles: string[]
  let newCsv: string[][]
  if (columnsHaveTitles) {
    [columnTitles, ...newCsv] = csv
  } else {
    columnTitles = csv[0].map((_, i) => `${i}`)
    newCsv = csv
  }

  return {
    columnTitles,
    csv: newCsv
  }
}

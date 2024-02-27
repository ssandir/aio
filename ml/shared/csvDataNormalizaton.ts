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

export function normalizeCsvToFeatureColumns (csv: string[][], columnTitles: string[], columnStringValueExpansionList: Record<string, string[]>): number[][] {
  const featureColumns: number[][] = csv.map(_ => [])
  for (let NColumn = 0; NColumn < csv[0].length; ++NColumn) {
    const columnName = columnTitles[NColumn]
    if (columnStringValueExpansionList[columnName] !== undefined) {
      for (let NRow = 0; NRow < csv.length; ++NRow) {
        if (!columnStringValueExpansionList[columnName].includes(csv[NRow][NColumn])) {
          throw new Error(`Non-numeric column "${columnName}" contains value "${csv[NRow][NColumn]}" not found in training data or validation data.`)
        }

        columnStringValueExpansionList[columnName].forEach(columnStringValue => {
          featureColumns[NRow].push(columnStringValue === csv[NRow][NColumn] ? 1 : 0)
        })
      }
    } else {
      for (let NRow = 0; NRow < csv.length; ++NRow) {
        const value = parseFloat(csv[NRow][NColumn])
        if (Number.isNaN(value)) {
          throw new Error(`Non-numeric value "${value}" found in numeric column "${columnTitles[NColumn]}".`)
        }
        featureColumns[NRow].push(value)
      }
    }
  }
  return featureColumns
}

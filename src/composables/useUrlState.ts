/**
 * useUrlState - Composable for URL state management
 * 
 * Handles reading and writing various state to URL parameters for:
 * - Column renames
 * - Visible columns
 * - Column widths
 * - Sort order
 * - Filters (symbol, thesis, asset class, account)
 * - Group by thesis toggle
 * - App name
 */

// Types
export type ColumnField =
  | 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid'
  | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice'
  | 'price' | 'market_price' | 'instrument_market_price' | 'market_value'
  | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry'
  | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct'
  | 'computed_be_price' | 'thesis' | 'maintenance_margin_change'
  | 'symbol_comment' | 'weighted_avg_price' | 'expiry_date'
  | 'dte' | 'delta' | 'unrealized_pnl_pct'
  | 'ul_entry_price' | 'ai_recommendation'

export type ColumnRenames = Partial<Record<ColumnField, string>>

export interface UrlFilters {
  symbol?: string
  asset_class?: string
  legal_entity?: string
  thesis?: string
}

export interface SortState {
  field: string
  dir: 'asc' | 'desc'
}

export interface ColumnOption {
  field: ColumnField
  label: string
}

export interface UseUrlStateOptions {
  windowId: string | null
  allColumnOptions: ColumnOption[]
  hiddenByDefault?: ColumnField[]
}

export function useUrlState(options: UseUrlStateOptions) {
  const { windowId, allColumnOptions, hiddenByDefault = [] } = options

  // --- Column Renames ---
  function parseColumnRenamesFromUrl(): ColumnRenames {
    const url = new URL(window.location.href)
    const param = url.searchParams.get(`${windowId}_position_col_renames`)
    if (!param) return {}
    try {
      const pairs = param.split('-and-')
      const renames: ColumnRenames = {}
      pairs.forEach(pair => {
        const [field, ...rest] = pair.split(':')
        if (field && rest.length) {
          renames[field as ColumnField] = decodeURIComponent(rest.join(':'))
        }
      })
      return renames
    } catch {
      return {}
    }
  }

  function writeColumnRenamesToUrl(renames: ColumnRenames) {
    const url = new URL(window.location.href)
    const pairs = Object.entries(renames)
      .filter(([_, name]) => name && name.trim())
      .map(([field, name]) => `${field}:${encodeURIComponent(name!)}`)
      .join('-and-')
    if (pairs) {
      url.searchParams.set(`${windowId}_position_col_renames`, pairs)
    } else {
      url.searchParams.delete(`${windowId}_position_col_renames`)
    }
    window.history.replaceState({}, '', url.toString())
  }

  // --- Visible Columns ---
  function parseVisibleColsFromUrl(): ColumnField[] {
    const url = new URL(window.location.href)
    const colsParam = url.searchParams.get(`${windowId}_position_cols`)
    if (!colsParam) {
      // Return all columns except hidden by default
      return allColumnOptions
        .map(c => c.field)
        .filter(field => !hiddenByDefault.includes(field))
    }
    const fromUrl = colsParam.split('-and-').map(s => s.trim()).filter(Boolean) as ColumnField[]
    const valid = new Set(allColumnOptions.map(c => c.field))
    return fromUrl.filter(c => valid.has(c))
  }

  function writeVisibleColsToUrl(cols: ColumnField[]) {
    const url = new URL(window.location.href)
    url.searchParams.set(`${windowId}_position_cols`, cols.join('-and-'))
    window.history.replaceState({}, '', url.toString())
  }

  // --- Column Widths ---
  function parseColumnWidthsFromUrl(): Record<string, number> {
    const url = new URL(window.location.href)
    const widthsParam = url.searchParams.get(`${windowId}_position_col_widths`)
    if (!widthsParam) return {}

    try {
      const pairs = widthsParam.split('-and-')
      const widths: Record<string, number> = {}
      pairs.forEach(pair => {
        const [field, width] = pair.split(':')
        if (field && width) {
          widths[field] = parseInt(width)
        }
      })
      return widths
    } catch (error) {
      console.warn('Error parsing column widths from URL:', error)
      return {}
    }
  }

  function writeColumnWidthsToUrl(widths: Record<string, number>) {
    const url = new URL(window.location.href)
    const widthPairs = Object.entries(widths)
      .filter(([_, width]) => width > 0)
      .map(([field, width]) => `${field}:${width}`)
      .join('-and-')

    if (widthPairs) {
      url.searchParams.set(`${windowId}_position_col_widths`, widthPairs)
    } else {
      url.searchParams.delete(`${windowId}_position_col_widths`)
    }
    window.history.replaceState({}, '', url.toString())
  }

  // --- Sort ---
  function parseSortFromUrl(): SortState | null {
    const url = new URL(window.location.href)
    const param = url.searchParams.get(`${windowId}_positions_sort`)
    if (!param) return null
    const [field, dir] = param.split(':')
    if (field && (dir === 'asc' || dir === 'desc')) {
      return { field, dir }
    }
    return null
  }

  function writeSortToUrl(field: string, dir: 'asc' | 'desc') {
    const url = new URL(window.location.href)
    url.searchParams.set(`${windowId}_positions_sort`, `${field}:${dir}`)
    window.history.replaceState({}, '', url.toString())
  }

  function clearSortFromUrl() {
    const url = new URL(window.location.href)
    url.searchParams.delete(`${windowId}_positions_sort`)
    window.history.replaceState({}, '', url.toString())
  }

  // --- Filters ---
  function parseFiltersFromUrl(): UrlFilters {
    const url = new URL(window.location.href)
    const symbolParam = url.searchParams.get(`${windowId}_all_cts_fi`)
    const symbol = symbolParam ? symbolParam.split('-and-').join(',') : undefined
    const asset = url.searchParams.get(`${windowId}_fac`) || undefined
    const account = url.searchParams.get(`all_cts_clientId`) || undefined
    const thesisParam = url.searchParams.get(`${windowId}_all_cts_thesis`)
    const thesis = thesisParam ? thesisParam.split('-and-').join(',') : undefined
    return { symbol, asset_class: asset, legal_entity: account, thesis }
  }

  function writeFiltersToUrl(filters: {
    symbolTagFilters: string[]
    thesisTagFilters: string[]
    assetClassFilter: string | null
  }) {
    const url = new URL(window.location.href)

    // Handle symbol filters
    if (filters.symbolTagFilters.length > 0) {
      url.searchParams.set(`${windowId}_all_cts_fi`, filters.symbolTagFilters.join('-and-'))
    } else {
      url.searchParams.delete(`${windowId}_all_cts_fi`)
    }

    // Handle thesis filters
    if (filters.thesisTagFilters.length > 0) {
      url.searchParams.set(`${windowId}_all_cts_thesis`, filters.thesisTagFilters.join('-and-'))
    } else {
      url.searchParams.delete(`${windowId}_all_cts_thesis`)
    }

    // Handle asset class filter
    if (filters.assetClassFilter) {
      url.searchParams.set(`${windowId}_fac`, filters.assetClassFilter)
    } else {
      url.searchParams.delete(`${windowId}_fac`)
    }

    window.history.replaceState({}, '', url.toString())
  }

  function writeAccountFilterToUrl(accountId: string | null) {
    const url = new URL(window.location.href)
    if (accountId) {
      url.searchParams.set(`all_cts_clientId`, accountId)
    } else {
      url.searchParams.delete(`all_cts_clientId`)
    }
    window.history.replaceState({}, '', url.toString())
  }

  function clearFiltersFromUrl() {
    const url = new URL(window.location.href)
    url.searchParams.delete(`all_cts_clientId`)
    url.searchParams.delete(`${windowId}_all_cts_fi`)
    url.searchParams.delete(`${windowId}_all_cts_thesis`)
    url.searchParams.delete(`${windowId}_fac`)
    window.history.replaceState({}, '', url.toString())
  }

  // --- Group By Thesis ---
  function parseGroupByThesisFromUrl(): boolean {
    const url = new URL(window.location.href)
    return url.searchParams.get(`${windowId}_group_by_thesis`) === 'true'
  }

  function writeGroupByThesisToUrl(isGrouped: boolean) {
    const url = new URL(window.location.href)
    if (isGrouped) {
      url.searchParams.set(`${windowId}_group_by_thesis`, 'true')
    } else {
      url.searchParams.delete(`${windowId}_group_by_thesis`)
    }
    window.history.replaceState({}, '', url.toString())
  }

  // --- App Name ---
  function parseAppNameFromUrl(defaultName: string = 'Positions'): string {
    const url = new URL(window.location.href)
    return url.searchParams.get(`${windowId}_positions_app_name`) || defaultName
  }

  function writeAppNameToUrl(name: string, defaultName: string = 'Positions') {
    const url = new URL(window.location.href)
    if (name && name.trim() && name !== defaultName) {
      url.searchParams.set(`${windowId}_positions_app_name`, name.trim())
    } else {
      url.searchParams.delete(`${windowId}_positions_app_name`)
    }
    window.history.replaceState({}, '', url.toString())
  }

  return {
    // Column Renames
    parseColumnRenamesFromUrl,
    writeColumnRenamesToUrl,

    // Visible Columns
    parseVisibleColsFromUrl,
    writeVisibleColsToUrl,

    // Column Widths
    parseColumnWidthsFromUrl,
    writeColumnWidthsToUrl,

    // Sort
    parseSortFromUrl,
    writeSortToUrl,
    clearSortFromUrl,

    // Filters
    parseFiltersFromUrl,
    writeFiltersToUrl,
    writeAccountFilterToUrl,
    clearFiltersFromUrl,

    // Group By Thesis
    parseGroupByThesisFromUrl,
    writeGroupByThesisToUrl,

    // App Name
    parseAppNameFromUrl,
    writeAppNameToUrl
  }
}

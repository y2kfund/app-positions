/**
 * useThesisConnection - Composable for thesis grouping and connection management
 * 
 * Handles:
 * - Updating thesis connections for positions
 * - Building hierarchical thesis data for grouped view
 * - Aggregating numeric values across thesis groups
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { QueryClient } from '@tanstack/vue-query'

// Types
export interface Thesis {
  id: string
  title: string
  parent_thesis_id?: string | null
  [key: string]: any
}

export interface Position {
  id?: number
  internal_account_id: string
  legal_entity?: string | { name?: string; id?: string }
  symbol: string
  asset_class: string
  conid: string
  thesis?: { id: string; title: string } | null
  [key: string]: any
}

export interface ThesisGroup {
  id: string
  _isThesisGroup: true
  _isParentThesis: boolean
  thesis: Thesis
  symbol: string
  legal_entity: string
  _children: any[] // Mixed Position and ThesisGroup children
  [key: string]: any
}

export interface UseThesisConnectionOptions {
  supabase: SupabaseClient
  queryClient: QueryClient
  numericFields: readonly string[]
  showToast?: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void
}

export interface ThesisGroupingOptions {
  sourcePositions: Position[]
  thesisData: Thesis[]
  groupByThesis: boolean
  accountFilter: string | null
  symbolTagFilters: string[]
  thesisTagFilters: string[]
  extractTagsFromSymbol: (symbol: string) => string[]
}

export function useThesisConnection(options: UseThesisConnectionOptions) {
  const { supabase, queryClient, numericFields, showToast } = options

  /**
   * Update thesis connection for a symbol root
   */
  async function updateThesisConnection(symbolRoot: string, thesisId: string | null): Promise<void> {
    try {
      if (thesisId) {
        const { error } = await supabase
          .schema('hf')
          .from('positionsAndThesisConnection')
          .upsert({
            symbol_root: symbolRoot,
            thesis_id: thesisId,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'symbol_root,thesis_id'
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .schema('hf')
          .from('positionsAndThesisConnection')
          .delete()
          .eq('symbol_root', symbolRoot)
        if (error) throw error
      }
      
      // Invalidate queries and wait for them to complete
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['positions'] }),
        queryClient.invalidateQueries({ queryKey: ['thesisConnections'] })
      ])
      
      showToast?.('success', 'Thesis Updated', `All ${symbolRoot} positions have been updated`)
    } catch (error: any) {
      console.error('Error updating thesis connection:', error)
      showToast?.('error', 'Error', `Failed to update thesis: ${error.message}`)
      throw error
    }
  }

  /**
   * Create grouped hierarchical data for thesis view
   * This is a pure function that takes raw values and returns grouped data
   */
  function createGroupedHierarchicalData(groupingOptions: ThesisGroupingOptions): (Position | ThesisGroup)[] {
    const {
      sourcePositions,
      thesisData,
      groupByThesis,
      accountFilter,
      symbolTagFilters,
      thesisTagFilters,
      extractTagsFromSymbol
    } = groupingOptions

    if (!groupByThesis || !sourcePositions || !thesisData) {
      return sourcePositions || []
    }

    // Filter positions that have a thesis
    let positionsWithThesis = sourcePositions.filter(
      (pos: Position) => pos.thesis && pos.thesis.id
    )

    // Apply account filter
    if (accountFilter) {
      positionsWithThesis = positionsWithThesis.filter((position: Position) => {
        const accountVal = typeof position.legal_entity === 'object' && position.legal_entity !== null
          ? ((position.legal_entity as any).name || (position.legal_entity as any).id)
          : position.legal_entity
        return accountVal === accountFilter
      })
    }

    // Apply symbol and thesis filters
    positionsWithThesis = positionsWithThesis.filter((position: Position) => {
      if (symbolTagFilters.length > 0) {
        const symbolText = position.symbol
        if (!symbolText) return false
        const tags = extractTagsFromSymbol(symbolText)
        const symbolPass = symbolTagFilters.every((selectedTag: string) => tags.includes(selectedTag))
        if (!symbolPass) return false
      }

      if (thesisTagFilters.length > 0) {
        const thesis = position.thesis
        if (!thesis || !thesis.title) return false
        const thesisPass = thesisTagFilters.includes(thesis.title)
        if (!thesisPass) return false
      }

      return true
    })
    
    // Build thesis hierarchy map
    const thesisMap = new Map<string, Thesis>()
    ;(thesisData || []).forEach((t: Thesis) => {
      thesisMap.set(t.id, { ...t })
    })
    
    // Group positions by thesis
    const positionsByThesis = new Map<string, Position[]>()
    positionsWithThesis.forEach((position: Position) => {
      const thesisId = position.thesis!.id
      if (!positionsByThesis.has(thesisId)) {
        positionsByThesis.set(thesisId, [])
      }
      positionsByThesis.get(thesisId)!.push(position)
    })
      
      // Build all thesis groups (including parents without direct positions)
      const allThesisGroups = new Map<string, ThesisGroup>()
      
      // Helper function to create a thesis group
      function createThesisGroup(thesisId: string, positions: Position[] = []): ThesisGroup | null {
        const thesis = thesisMap.get(thesisId)
        if (!thesis) return null
        
        const thesisGroup: ThesisGroup = {
          id: `thesis-${thesisId}`,
          _isThesisGroup: true,
          _isParentThesis: !thesis.parent_thesis_id,
          thesis,
          symbol: thesis.parent_thesis_id 
            ? `  ├─ 📁 ${thesis.title}` 
            : `📊 PARENT: ${thesis.title}`,
          legal_entity: `${positions.length} position${positions.length !== 1 ? 's' : ''}`,
          _children: positions.map(p => ({
            ...p,
            id: `pos-${p.conid}-${p.internal_account_id}`
          }))
        }
        
        // Calculate totals for the thesis group from direct positions
        for (const field of numericFields) {
          ;(thesisGroup as any)[field] = positions.reduce((sum: number, pos: any) => {
            const value = pos[field]
            return sum + (typeof value === 'number' && Number.isFinite(value) ? value : 0)
          }, 0)
        }
        
        return thesisGroup
      }
      
      // Helper function to aggregate child values into parent
      function aggregateChildValues(parentGroup: ThesisGroup, childGroup: ThesisGroup): void {
        for (const field of numericFields) {
          const parentValue = (parentGroup as any)[field] || 0
          const childValue = (childGroup as any)[field] || 0
          ;(parentGroup as any)[field] = parentValue + childValue
        }
      }
      
      // First pass: Create groups for all theses that have positions OR have children with positions
      positionsByThesis.forEach((positions, thesisId) => {
        const group = createThesisGroup(thesisId, positions)
        if (group) {
          allThesisGroups.set(thesisId, group)
        }
      })
      
      // Second pass: Ensure parent thesis exist (even without direct positions)
      const thesisIdsWithData = new Set(allThesisGroups.keys())
      
      function ensureParentExists(thesisId: string): void {
        const thesis = thesisMap.get(thesisId)
        if (!thesis || !thesis.parent_thesis_id) return
        
        const parentId = thesis.parent_thesis_id
        
        // If parent doesn't exist, create it
        if (!allThesisGroups.has(parentId)) {
          const parentGroup = createThesisGroup(parentId, [])
          if (parentGroup) {
            allThesisGroups.set(parentId, parentGroup)
          }
        }
        
        // Recursively ensure grandparents exist
        ensureParentExists(parentId)
      }
      
      // Ensure all parent theses exist
      thesisIdsWithData.forEach(thesisId => {
        ensureParentExists(thesisId)
      })
      
      // Third pass: Build the hierarchy and aggregate values
      const childThesisMap = new Map<string, ThesisGroup[]>()
      
      allThesisGroups.forEach((group, thesisId) => {
        const thesis = thesisMap.get(thesisId)
        if (!thesis) return
        
        if (thesis.parent_thesis_id && allThesisGroups.has(thesis.parent_thesis_id)) {
          // This is a child thesis with an existing parent
          if (!childThesisMap.has(thesis.parent_thesis_id)) {
            childThesisMap.set(thesis.parent_thesis_id, [])
          }
          childThesisMap.get(thesis.parent_thesis_id)!.push(group)
        }
      })
      
      // Fourth pass: Attach children to parents and aggregate values
      const processedParents = new Set<string>()
      
      function attachChildrenAndAggregate(parentId: string): void {
        if (processedParents.has(parentId)) return
        processedParents.add(parentId)
        
        const parentGroup = allThesisGroups.get(parentId)
        if (!parentGroup) return
        
        const children = childThesisMap.get(parentId) || []
        
        // First, recursively process all children
        children.forEach(child => {
          attachChildrenAndAggregate(child.thesis.id)
        })
        
        // Then attach children and aggregate their values
        if (children.length > 0) {
          // Update the position count to include child positions
          const totalPositions = parentGroup._children.length + 
            children.reduce((sum, child) => {
              const childPositionCount = (child.legal_entity as string).match(/\d+/)?.[0] || '0'
              return sum + parseInt(childPositionCount)
            }, 0)
          
          parentGroup.legal_entity = `${totalPositions} position${totalPositions !== 1 ? 's' : ''}`
          
          // Aggregate child values into parent
          children.forEach(child => {
            aggregateChildValues(parentGroup, child)
          })
          
          // Add children to parent
          parentGroup._children = [...parentGroup._children, ...children]
        }
      }
      
      // Process all root theses (and their descendants)
      allThesisGroups.forEach((group, thesisId) => {
        const thesis = thesisMap.get(thesisId)
        if (thesis && !thesis.parent_thesis_id) {
          attachChildrenAndAggregate(thesisId)
        }
      })
      
      // Fifth pass: Collect root thesis groups
      const rootThesisGroups: ThesisGroup[] = []
      allThesisGroups.forEach((group, thesisId) => {
        const thesis = thesisMap.get(thesisId)
        if (thesis && !thesis.parent_thesis_id) {
          rootThesisGroups.push(group)
        }
      })
      
      return rootThesisGroups
  }

  /**
   * Check if a row is a thesis group
   */
  function isThesisGroup(row: any): row is ThesisGroup {
    return row && row._isThesisGroup === true
  }

  /**
   * Check if a row is a parent thesis group
   */
  function isParentThesisGroup(row: any): boolean {
    return isThesisGroup(row) && row._isParentThesis === true
  }

  return {
    updateThesisConnection,
    createGroupedHierarchicalData,
    isThesisGroup,
    isParentThesisGroup
  }
}

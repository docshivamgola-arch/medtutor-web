/**
 * NODE_REGISTRY — static metadata map for every available organ node.
 *
 * Keyed by nodeId (matches the :nodeId route param and the JSON file names in
 * src/data/nodes/). Each entry holds display metadata only; the full data
 * payload (cuts + pyqs) is loaded on demand via useNodeData.
 *
 * Add a new entry here whenever a new node JSON file is created.
 */

export interface NodeMeta {
  /** URL-safe identifier — matches the JSON filename without extension */
  nodeId: string;
  /** Human-readable display title */
  title: string;
  /** Medical system / specialty */
  system: string;
  /** Total number of instructional cuts in this node */
  cutCount: number;
  /** Emoji icon shown in navigation and cards */
  icon: string;
}

export const NODE_REGISTRY: Record<string, NodeMeta> = {
  thyroid: {
    nodeId: 'thyroid',
    title: 'Thyroid & Parathyroid',
    system: 'Endocrinology',
    cutCount: 20,
    icon: '🦋', // butterfly emoji — reflects bilobed thyroid shape
  },
  liver: {
    nodeId: 'liver',
    title: 'Liver & Jaundice',
    system: 'Gastroenterology',
    cutCount: 18,
    icon: '🫀', // anatomical heart/organ emoji proxy for liver
  },
};

/** Ordered list of all registered nodes, useful for sidebar or grid rendering. */
export const NODE_LIST: NodeMeta[] = Object.values(NODE_REGISTRY);

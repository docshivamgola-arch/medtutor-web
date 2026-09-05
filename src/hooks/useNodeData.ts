/**
 * useNodeData — parameterised organ node data loader.
 *
 * S1: loads from static JSON imports (Vite resolves at build time).
 * S2: will lazy-load from Supabase, keyed by nodeId.
 *
 * Compatible with thyroidData.ts existing types (ChapterCut, PYQQuestion):
 *   - NodeCut is a superset that accepts both the full thyroid schema
 *     (cutNumber, timecode, durationSec, subject, …) and the simplified
 *     liver schema (duration, hook, tags).
 *   - NodePYQ similarly bridges the thyroid (exam, correctIndex, buzzword)
 *     and liver (source, correct, wikiSlug) field sets.
 *   - ChapterCut and PYQQuestion from thyroidData.ts are both structurally
 *     assignable to NodeCut / NodePYQ, so existing components can pass
 *     either without type casting.
 */

import thyroidJson from '../data/nodes/thyroid.json';
import liverJson from '../data/nodes/liver.json';

// ---------------------------------------------------------------------------
// Shared type definitions
// ---------------------------------------------------------------------------

/** A single instructional segment within a node. Covers both the full thyroid
 *  schema (cutNumber, timecode, durationSec, subject, …) and the simplified
 *  liver schema (duration, hook, tags). */
export interface NodeCut {
  id: string;
  title: string;

  // --- Full / thyroid-format fields (from ChapterCut in thyroidData.ts) ---
  cutNumber?: number;
  timecode?: string;
  /** Duration in seconds — same field name as ChapterCut.durationSec */
  durationSec?: number;
  /** Single subject tag (string union in ChapterCut; relaxed to string here) */
  subject?: string;
  subjectColor?: string;
  visualSummary?: string;
  coreConcept?: string;
  highYieldBullets?: string[];
  mnemonic?: string;
  neetQuote?: string;

  // --- Simplified / liver-format fields ---
  /** Duration in seconds — simplified name used in liver.json */
  duration?: number;
  /** One-sentence description of what the cut covers */
  hook?: string;
  /** Array of subject/discipline tags */
  tags?: string[];
}

/** A previous-year question associated with a node. Covers both the full
 *  thyroid schema (exam, correctIndex, buzzword, subjectTag) and the simplified
 *  liver schema (source, correct, wikiSlug). */
export interface NodePYQ {
  id: string;
  question: string;
  options: string[];
  explanation?: string;
  year?: string;

  // --- Full / thyroid-format fields (from PYQQuestion in thyroidData.ts) ---
  exam?: string;
  /** Zero-based correct option index — used in thyroid PYQs */
  correctIndex?: number;
  buzzword?: string;
  subjectTag?: string;

  // --- Simplified / liver-format fields ---
  /** Exam source label (e.g. "NEET-PG", "AIIMS", "PGI") */
  source?: string;
  /** Zero-based correct option index — used in liver PYQs */
  correct?: number;
  /** URL slug for the companion wiki article */
  wikiSlug?: string;
}

/** Complete data payload for a single organ node. */
export interface NodeData {
  nodeId: string;
  title: string;
  system: string;
  cutCount?: number;
  cuts: NodeCut[];
  pyqs: NodePYQ[];
}

// ---------------------------------------------------------------------------
// Static node map (S1 — replaced by Supabase fetch in S2)
// ---------------------------------------------------------------------------

const NODE_MAP: Record<string, NodeData> = {
  thyroid: thyroidJson as unknown as NodeData,
  liver: liverJson as unknown as NodeData,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the full NodeData (cuts + pyqs) for the requested nodeId.
 * Falls back to the thyroid node if nodeId is not recognised.
 *
 * @param nodeId - The route parameter value from /node/:nodeId
 */
export function useNodeData(nodeId: string): NodeData {
  return NODE_MAP[nodeId] ?? NODE_MAP.thyroid;
}

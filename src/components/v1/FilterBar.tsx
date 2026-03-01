"use client";

import { Difficulty, ALL_TAGS } from "@/data/recipes";
import TagChip from "@/components/v1/TagChip";

export interface FilterState {
  tags: string[];
  difficulty: Difficulty | "";
  maxTime: number;
  sort: "name" | "time" | "difficulty";
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const TIME_OPTIONS = [
  { label: "Any time", value: 0 },
  { label: "≤ 45 min", value: 45 },
  { label: "≤ 60 min", value: 60 },
  { label: "≤ 90 min", value: 90 },
];

const DIFFICULTIES: Array<Difficulty | ""> = ["", "Easy", "Medium", "Hard"];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggleTag(tag: string) {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: newTags });
  }

  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>Sort By</h3>
        <select value={filters.sort} onChange={(e) => onChange({ ...filters, sort: e.target.value as FilterState["sort"] })} className="museum-input text-sm">
          <option value="name">Name (A–Z)</option>
          <option value="time">Time (Shortest)</option>
          <option value="difficulty">Difficulty (Easiest)</option>
        </select>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>Difficulty</h3>
        <div className="flex flex-col gap-2">
          {DIFFICULTIES.map((d) => (
            <button key={d || "all"} type="button" onClick={() => onChange({ ...filters, difficulty: d })}
              className="text-left px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{ backgroundColor: filters.difficulty === d ? "var(--mint-light)" : "transparent", color: filters.difficulty === d ? "var(--mint-dark)" : "var(--ink-light)", fontWeight: filters.difficulty === d ? "600" : "400", border: filters.difficulty === d ? "1px solid var(--border-mint)" : "1px solid transparent" }}>
              {d || "All Difficulties"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>Time</h3>
        <div className="flex flex-col gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => onChange({ ...filters, maxTime: opt.value })}
              className="text-left px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{ backgroundColor: filters.maxTime === opt.value ? "var(--mint-light)" : "transparent", color: filters.maxTime === opt.value ? "var(--mint-dark)" : "var(--ink-light)", fontWeight: filters.maxTime === opt.value ? "600" : "400", border: filters.maxTime === opt.value ? "1px solid var(--border-mint)" : "1px solid transparent" }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--ink-muted)" }}>Tags</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <TagChip key={tag} label={tag} active={filters.tags.includes(tag)} onClick={() => toggleTag(tag)} />
          ))}
        </div>
      </div>
      {(filters.tags.length > 0 || filters.difficulty || filters.maxTime > 0) && (
        <button type="button" onClick={() => onChange({ tags: [], difficulty: "", maxTime: 0, sort: filters.sort })} className="museum-btn-outline text-sm">
          Clear Filters
        </button>
      )}
    </aside>
  );
}

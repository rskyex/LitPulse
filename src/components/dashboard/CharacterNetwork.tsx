"use client";

import { useState } from "react";
import type { Character, Relationship } from "@/lib/types";
import { roleColors, relationshipColors, relationshipDash } from "@/lib/colors";

interface Props {
  characters: Character[];
  relationships: Relationship[];
}

interface NodePos {
  id: string;
  x: number;
  y: number;
  character: Character;
}

function layoutNodes(characters: Character[], w: number, h: number): NodePos[] {
  const cx = w / 2;
  const cy = h / 2;
  const protagonists = characters.filter((c) => c.role === "protagonist");
  const others = characters.filter((c) => c.role !== "protagonist");

  const nodes: NodePos[] = [];

  // Place protagonists near center
  protagonists.forEach((c, i) => {
    const offset = protagonists.length > 1 ? (i - 0.5) * 60 : 0;
    nodes.push({ id: c.id, x: cx + offset, y: cy, character: c });
  });

  // Place others in a circle around center
  const radius = Math.min(w, h) * 0.35;
  others.forEach((c, i) => {
    const angle = (2 * Math.PI * i) / others.length - Math.PI / 2;
    nodes.push({
      id: c.id,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      character: c,
    });
  });

  return nodes;
}

export default function CharacterNetwork({ characters, relationships }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const w = 500;
  const h = 380;
  const nodes = layoutNodes(characters, w, h);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="rounded-xl border border-parchment-dark bg-white p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold">Character Network</h3>
      <p className="mb-4 text-xs text-ink-muted">
        Connections between characters — hover to see relationships
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 380 }}>
        {/* Edges */}
        {relationships.map((rel, i) => {
          const s = nodeMap.get(rel.source);
          const t = nodeMap.get(rel.target);
          if (!s || !t) return null;
          const isHighlighted =
            hovered === rel.source || hovered === rel.target;
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={relationshipColors[rel.type] || "#a8a29e"}
              strokeWidth={isHighlighted ? rel.strength / 2.5 : rel.strength / 4}
              strokeDasharray={relationshipDash[rel.type] || ""}
              opacity={hovered ? (isHighlighted ? 1 : 0.15) : 0.6}
              className="transition-all duration-200"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHighlighted =
            !hovered || hovered === node.id ||
            relationships.some(
              (r) =>
                (r.source === hovered && r.target === node.id) ||
                (r.target === hovered && r.source === node.id)
            );
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
              opacity={hovered ? (isHighlighted ? 1 : 0.3) : 1}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.character.role === "protagonist" ? 22 : 16}
                fill={roleColors[node.character.role]}
                stroke="#fff"
                strokeWidth={2.5}
                className="transition-all duration-200"
              />
              <text
                x={node.x}
                y={node.y + (node.character.role === "protagonist" ? 34 : 28)}
                textAnchor="middle"
                fontSize={11}
                fill="#44403c"
                fontWeight={500}
              >
                {node.character.name.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
        {Object.entries(relationshipColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-4 rounded-sm"
              style={{ backgroundColor: color }}
            />
            {type}
          </span>
        ))}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="mt-3 rounded-lg bg-parchment p-3 text-sm">
          <p className="font-medium">
            {characters.find((c) => c.id === hovered)?.name}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {characters.find((c) => c.id === hovered)?.description}
          </p>
          <div className="mt-2 space-y-1">
            {relationships
              .filter((r) => r.source === hovered || r.target === hovered)
              .map((r, i) => (
                <p key={i} className="text-xs">
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: relationshipColors[r.type] }}
                  />
                  {r.description}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { getBadgeColor } from '../utils/formatters';

const SkillBadge = ({ name, category, level, years, onRemove }) => {
  const colorClass = getBadgeColor(category);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <span>{name}</span>
      {level && <span className="opacity-75 text-[10px]">({level})</span>}
      {years && <span className="opacity-75 text-[10px]">{years}y</span>}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-rose-600 transition"
          title="Remove Skill"
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default SkillBadge;

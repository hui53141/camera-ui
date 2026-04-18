export interface HighlightResult {
  highlighted: boolean;
  color: string;
  reason: string;
}

/**
 * Evaluate a single highlight rule condition against a metric value.
 *
 * Supported condition formats:
 *   "> threshold", "< threshold"
 *   "> baseline * 1.2", "< baseline * 0.9"
 *   "> 100", "< 30"  (literal numbers)
 */
export function evaluateRule(
  value: number,
  baseline: number | null,
  threshold: number | null,
  condition: string,
): HighlightResult {
  const notHighlighted: HighlightResult = {
    highlighted: false,
    color: '',
    reason: '',
  };

  const trimmed = condition.trim();

  // Extract operator and expression
  const match = trimmed.match(/^([<>]=?)\s*(.+)$/);
  if (!match) return notHighlighted;

  const operator = match[1];
  const expr = match[2].trim();

  // Resolve the right-hand side to a number
  let target: number | null = null;

  if (/^threshold$/i.test(expr)) {
    target = threshold;
  } else if (/^baseline$/i.test(expr)) {
    target = baseline;
  } else if (/^baseline\s*\*\s*\d+(\.\d+)?$/i.test(expr)) {
    if (baseline === null) return notHighlighted;
    const multiplierMatch = expr.match(/\*\s*(\d+(?:\.\d+)?)$/);
    if (!multiplierMatch) return notHighlighted;
    target = baseline * parseFloat(multiplierMatch[1]);
  } else if (/^threshold\s*\*\s*\d+(\.\d+)?$/i.test(expr)) {
    if (threshold === null) return notHighlighted;
    const multiplierMatch = expr.match(/\*\s*(\d+(?:\.\d+)?)$/);
    if (!multiplierMatch) return notHighlighted;
    target = threshold * parseFloat(multiplierMatch[1]);
  } else {
    const literal = parseFloat(expr);
    if (isNaN(literal)) return notHighlighted;
    target = literal;
  }

  if (target === null) return notHighlighted;

  let conditionMet = false;
  switch (operator) {
    case '>':
      conditionMet = value > target;
      break;
    case '>=':
      conditionMet = value >= target;
      break;
    case '<':
      conditionMet = value < target;
      break;
    case '<=':
      conditionMet = value <= target;
      break;
  }

  if (conditionMet) {
    return {
      highlighted: true,
      color: '#ef4444',
      reason: `Value ${value} matches condition: ${condition} (target: ${target.toFixed(2)})`,
    };
  }

  return notHighlighted;
}

export function getDefaultRulesForType(
  metricType: string,
): Array<{ condition: string; color: string; ruleName: string }> {
  switch (metricType) {
    case 'startup':
      return [
        {
          condition: '> threshold',
          color: '#ef4444',
          ruleName: 'Over threshold',
        },
        {
          condition: '> baseline * 1.2',
          color: '#f97316',
          ruleName: '20% regression',
        },
      ];
    case 'switching':
      return [
        {
          condition: '> threshold',
          color: '#ef4444',
          ruleName: 'Over threshold',
        },
        {
          condition: '> baseline * 1.2',
          color: '#f97316',
          ruleName: '20% regression',
        },
      ];
    case 'frame_rate':
      return [
        {
          condition: '< threshold',
          color: '#ef4444',
          ruleName: 'Below threshold FPS',
        },
        {
          condition: '< baseline * 0.9',
          color: '#f97316',
          ruleName: '10% FPS drop',
        },
      ];
    case 'static_memory':
      return [
        {
          condition: '> threshold',
          color: '#ef4444',
          ruleName: 'Over memory threshold',
        },
      ];
    case 'peak_memory':
      return [
        {
          condition: '> threshold',
          color: '#ef4444',
          ruleName: 'Over memory threshold',
        },
        {
          condition: '> baseline * 1.3',
          color: '#f97316',
          ruleName: '30% memory growth',
        },
      ];
    default:
      return [];
  }
}

export function checkHighlight(
  value: number,
  baseline: number | null,
  threshold: number | null,
  rules: Array<{ condition: string; color: string; ruleName: string }>,
): HighlightResult {
  for (const rule of rules) {
    const result = evaluateRule(value, baseline, threshold, rule.condition);
    if (result.highlighted) {
      return {
        highlighted: true,
        color: rule.color,
        reason: `${rule.ruleName}: ${result.reason}`,
      };
    }
  }

  return { highlighted: false, color: '', reason: '' };
}

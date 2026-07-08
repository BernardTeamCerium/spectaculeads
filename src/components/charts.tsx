import { Fragment } from 'react';
import Svg, { Circle, Line, Path, Polyline, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

export interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Point on a circle, with 0° at the top (12 o'clock), degrees clockwise. */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Solid pie chart. */
export function PieChart({ data, size = 168 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  let start = 0;
  return (
    <Svg width={size} height={size}>
      {data.map((d, i) => {
        const sweep = (d.value / total) * 360;
        const end = start + sweep;
        const [x1, y1] = polar(cx, cy, r, start);
        const [x2, y2] = polar(cx, cy, r, end);
        const large = sweep > 180 ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        start = end;
        return <Path key={i} d={path} fill={d.color} />;
      })}
    </Svg>
  );
}

/** Donut chart drawn as filled annular sectors (no rotation transforms). */
export function DonutChart({
  data,
  size = 168,
  thickness = 34,
}: {
  data: Slice[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;
  const r = R - thickness;
  let start = 0;
  return (
    <Svg width={size} height={size}>
      {data.map((d, i) => {
        const sweep = (d.value / total) * 360;
        const end = start + sweep;
        const [ox1, oy1] = polar(cx, cy, R, start);
        const [ox2, oy2] = polar(cx, cy, R, end);
        const [ix2, iy2] = polar(cx, cy, r, end);
        const [ix1, iy1] = polar(cx, cy, r, start);
        const large = sweep > 180 ? 1 : 0;
        const path =
          `M ${ox1} ${oy1} A ${R} ${R} 0 ${large} 1 ${ox2} ${oy2} ` +
          `L ${ix2} ${iy2} A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1} Z`;
        start = end;
        return <Path key={i} d={path} fill={d.color} />;
      })}
    </Svg>
  );
}

/** Simple money line chart with horizontal gridlines + axis labels. */
export function LineChart({
  data,
  width,
  height = 180,
}: {
  data: { label: string; value: number }[];
  width: number;
  height?: number;
}) {
  const padL = 40;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const maxV = Math.max(1, ...data.map((d) => d.value));
  const step = 100_000;
  const niceMax = Math.ceil(maxV / step) * step;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const x = (i: number) => padL + (data.length <= 1 ? 0 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => padT + plotH - (v / niceMax) * plotH;
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');

  const ticks: number[] = [];
  for (let t = 0; t <= niceMax; t += step) ticks.push(t);

  return (
    <Svg width={width} height={height}>
      {ticks.map((t, i) => (
        <Fragment key={i}>
          <Line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} stroke={colors.border} strokeWidth={1} />
          <SvgText x={padL - 6} y={y(t) + 3.5} fontSize={9} fill={colors.muted} textAnchor="end">
            {`${Math.round(t / 1000)}k`}
          </SvgText>
        </Fragment>
      ))}
      <Polyline points={pts} fill="none" stroke={colors.teal} strokeWidth={2.5} />
      {data.map((d, i) => (
        <Circle key={i} cx={x(i)} cy={y(d.value)} r={3.5} fill={colors.teal} />
      ))}
      {data.map((d, i) => (
        <SvgText key={`l${i}`} x={x(i)} y={height - 6} fontSize={9} fill={colors.muted} textAnchor="middle">
          {d.label}
        </SvgText>
      ))}
    </Svg>
  );
}

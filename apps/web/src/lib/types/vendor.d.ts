/* eslint-disable @typescript-eslint/no-explicit-any -- loose stubs for the few
   d3 functions we import that have no bundled types; the real shapes are
   irrelevant because we only pass the factories into chart components. */
declare module 'd3-scale' {
	export function scaleUtc(): any;
}

declare module 'd3-shape' {
	export const curveLinear: any;
}

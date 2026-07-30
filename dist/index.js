import { createContext, use, useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { Area, AreaChart as AreaChart$1, Bar, BarChart as BarChart$1, CartesianGrid, Line, LineChart as LineChart$1, ResponsiveContainer, Tooltip as Tooltip$1, XAxis, YAxis } from "recharts";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { motion, useReducedMotion } from "motion/react";
import { Checkbox as Checkbox$1, Dialog, DropdownMenu, Label, Popover as Popover$1, RadioGroup as RadioGroup$1, Select as Select$1, Switch as Switch$1, Tabs as Tabs$1, Tooltip as Tooltip$2 } from "radix-ui";
import { Toaster as Toaster$1, toast as toast$1 } from "sonner";
//#region src/lib/cn.ts
const cn = (...parts) => parts.filter(Boolean).join(" ");
//#endregion
//#region src/charts/chart-parts.tsx
const CHART_MARGIN = {
	top: 8,
	right: 8,
	bottom: 0,
	left: 0
};
const AXIS_FONT_SIZE = 11;
const seriesColor = (theme, index) => theme.series[index % theme.series.length] ?? theme.axis;
/** The container carries the accessible name; everything recharts draws is
*  hidden, and `accessibilityLayer` is off so the SVG is neither focusable nor
*  announced as an application. */
function ChartFrame({ height, className, style, children, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		role: "img",
		className: cn("text-default", className),
		style: {
			height,
			...style
		},
		...rest,
		children: /* @__PURE__ */ jsx(ResponsiveContainer, {
			"aria-hidden": true,
			width: "100%",
			height: "100%",
			children
		})
	});
}
const grid = (theme) => /* @__PURE__ */ jsx(CartesianGrid, {
	stroke: theme.grid,
	strokeDasharray: "2 2",
	vertical: false
});
const xAxis = (theme, dataKey, format) => /* @__PURE__ */ jsx(XAxis, {
	dataKey,
	axisLine: false,
	tickLine: false,
	tickMargin: 8,
	minTickGap: 16,
	tick: {
		fill: theme.axis,
		fontSize: AXIS_FONT_SIZE
	},
	tickFormatter: format
});
const yAxis = (theme, format) => /* @__PURE__ */ jsx(YAxis, {
	axisLine: false,
	tickLine: false,
	tickMargin: 8,
	width: 48,
	tick: {
		fill: theme.axis,
		fontSize: AXIS_FONT_SIZE
	},
	tickFormatter: format
});
const tooltip = (theme, options = {}) => /* @__PURE__ */ jsx(Tooltip$1, {
	cursor: options.cursor === "band" ? {
		fill: theme.cursor,
		fillOpacity: .5
	} : {
		stroke: theme.cursor,
		strokeWidth: 1
	},
	content: /* @__PURE__ */ jsx(ChartTooltip, {
		formatLabel: options.formatLabel,
		formatValue: options.formatValue
	})
});
const formatted = (value, format) => {
	if (typeof value !== "string" && typeof value !== "number") return "";
	return format ? format(value) : String(value);
};
function ChartTooltip({ active, payload, label, formatLabel, formatValue }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-raise border border-default rounded-lg shadow-menu text-sans-12 px-2.5 py-2",
		children: [label !== void 0 && /* @__PURE__ */ jsx("div", {
			className: "text-tertiary text-mono-xs pb-1.5",
			children: formatted(label, formatLabel)
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-col gap-1",
			children: payload.map((entry) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "h-1.5 w-1.5 shrink-0 rounded-full",
						style: { backgroundColor: entry.color ?? entry.stroke ?? entry.fill }
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-secondary",
						children: entry.name
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-default ml-auto pl-3 tabular-nums",
						children: formatted(entry.value, formatValue)
					})
				]
			}, entry.graphicalItemId))
		})]
	});
}
//#endregion
//#region src/lib/observe-theme.ts
/** Notifies on `data-theme` flips on the document element. Callers re-read the
*  parts of the theme they care about; this only reports that it changed. */
const observeTheme = (onChange) => {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"]
	});
	return () => observer.disconnect();
};
//#endregion
//#region src/charts/use-chart-theme.ts
const SERIES_TOKENS = [
	"--content-accent",
	"--content-info",
	"--content-accent-alt",
	"--content-notice",
	"--content-error"
];
/** Charts paint SVG attributes, which cannot reference a CSS variable that has
*  not resolved yet. `currentColor` inherits the container's text colour so a
*  server-rendered chart is still legible instead of black-on-black. */
const UNRESOLVED = "currentColor";
const FALLBACK = {
	grid: UNRESOLVED,
	axis: UNRESOLVED,
	cursor: UNRESOLVED,
	series: SERIES_TOKENS.map(() => UNRESOLVED)
};
const readTheme$1 = () => {
	if (typeof window === "undefined") return FALLBACK;
	const style = getComputedStyle(document.documentElement);
	const token = (name) => style.getPropertyValue(name).trim() || UNRESOLVED;
	return {
		grid: token("--stroke-tertiary"),
		axis: token("--content-tertiary"),
		cursor: token("--surface-hover"),
		series: SERIES_TOKENS.map(token)
	};
};
/** Resolved token colours for chart internals, re-read whenever the document
*  theme flips so charts restyle in place rather than remounting. */
function useChartTheme() {
	const [theme, setTheme] = useState(readTheme$1);
	useEffect(() => observeTheme(() => setTheme(readTheme$1())), []);
	return theme;
}
//#endregion
//#region src/charts/area-chart.tsx
const CURVE = {
	smooth: "monotone",
	step: "step"
};
function AreaChart({ data, xKey, yKey, height = 220, variant = "smooth", formatX, formatY, ...rest }) {
	const theme = useChartTheme();
	const color = seriesColor(theme, 0);
	const gradientId = useId();
	return /* @__PURE__ */ jsx(ChartFrame, {
		height,
		...rest,
		children: /* @__PURE__ */ jsxs(AreaChart$1, {
			data,
			margin: CHART_MARGIN,
			accessibilityLayer: false,
			children: [
				/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
					id: gradientId,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ jsx("stop", {
						offset: "0%",
						stopColor: color,
						stopOpacity: .35
					}), /* @__PURE__ */ jsx("stop", {
						offset: "100%",
						stopColor: color,
						stopOpacity: 0
					})]
				}) }),
				grid(theme),
				xAxis(theme, xKey, formatX),
				yAxis(theme, formatY),
				tooltip(theme, {
					formatLabel: formatX,
					formatValue: formatY
				}),
				/* @__PURE__ */ jsx(Area, {
					type: CURVE[variant],
					dataKey: yKey,
					stroke: color,
					strokeWidth: 2,
					fill: `url(#${gradientId})`,
					activeDot: {
						r: 3,
						fill: color,
						stroke: color
					}
				})
			]
		})
	});
}
//#endregion
//#region src/charts/bar-chart.tsx
const TOP_RADIUS = [
	2,
	2,
	0,
	0
];
function BarChart({ data, xKey, series, height = 220, stacked = false, formatX, formatY, ...rest }) {
	const theme = useChartTheme();
	const last = series.length - 1;
	return /* @__PURE__ */ jsx(ChartFrame, {
		height,
		...rest,
		children: /* @__PURE__ */ jsxs(BarChart$1, {
			data,
			margin: CHART_MARGIN,
			accessibilityLayer: false,
			children: [
				grid(theme),
				xAxis(theme, xKey, formatX),
				yAxis(theme, formatY),
				tooltip(theme, {
					formatLabel: formatX,
					formatValue: formatY,
					cursor: "band"
				}),
				series.map((entry, index) => /* @__PURE__ */ jsx(Bar, {
					dataKey: entry.key,
					name: entry.label,
					fill: entry.color ?? seriesColor(theme, index),
					stackId: stacked ? "stack" : void 0,
					radius: stacked && index !== last ? void 0 : TOP_RADIUS,
					maxBarSize: 32
				}, entry.key))
			]
		})
	});
}
//#endregion
//#region src/charts/line-chart.tsx
function LineChart({ data, xKey, series, height = 220, formatX, formatY, ...rest }) {
	const theme = useChartTheme();
	return /* @__PURE__ */ jsx(ChartFrame, {
		height,
		...rest,
		children: /* @__PURE__ */ jsxs(LineChart$1, {
			data,
			margin: CHART_MARGIN,
			accessibilityLayer: false,
			children: [
				grid(theme),
				xAxis(theme, xKey, formatX),
				yAxis(theme, formatY),
				tooltip(theme, {
					formatLabel: formatX,
					formatValue: formatY
				}),
				series.map((entry, index) => {
					const color = entry.color ?? seriesColor(theme, index);
					return /* @__PURE__ */ jsx(Line, {
						type: "monotone",
						dataKey: entry.key,
						name: entry.label,
						stroke: color,
						strokeWidth: 2,
						dot: false,
						activeDot: {
							r: 3,
							fill: color,
							stroke: color
						}
					}, entry.key);
				})
			]
		})
	});
}
//#endregion
//#region src/charts/sparkline.tsx
/** Stroke width is inset by the margin so the curve is not clipped at the edges. */
const MARGIN = {
	top: 2,
	right: 2,
	bottom: 2,
	left: 2
};
function Sparkline({ data, yKey, height = 24, color, ...rest }) {
	const theme = useChartTheme();
	return /* @__PURE__ */ jsx(ChartFrame, {
		height,
		...rest,
		children: /* @__PURE__ */ jsx(LineChart$1, {
			data,
			margin: MARGIN,
			accessibilityLayer: false,
			children: /* @__PURE__ */ jsx(Line, {
				type: "monotone",
				dataKey: yKey,
				stroke: color ?? seriesColor(theme, 0),
				strokeWidth: 1.5,
				dot: false,
				isAnimationActive: false
			})
		})
	});
}
//#endregion
//#region src/icons/icons.tsx
const Icon = (props) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 18 18",
	width: "1em",
	height: "1em",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true,
	focusable: false,
	...props
});
const ChevronDown = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M5 7 L9 11 L13 7" })
});
const ChevronUp = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M5 11 L9 7 L13 11" })
});
const ChevronLeft = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M11 5 L7 9 L11 13" })
});
const ChevronRight = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M7 5 L11 9 L7 13" })
});
const Check = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M4 9.5 L7 12.5 L14 5.5" })
});
const Close = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [/* @__PURE__ */ jsx("path", { d: "M5 5 L13 13" }), /* @__PURE__ */ jsx("path", { d: "M13 5 L5 13" })]
});
const Search = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "8",
		cy: "8",
		r: "4.5"
	}), /* @__PURE__ */ jsx("path", { d: "M11.5 11.5 L14.5 14.5" })]
});
const Minus = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M4.5 9 H13.5" })
});
const Plus = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [/* @__PURE__ */ jsx("path", { d: "M9 4.5 V13.5" }), /* @__PURE__ */ jsx("path", { d: "M4.5 9 H13.5" })]
});
const DotsHorizontal = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [
		/* @__PURE__ */ jsx("circle", {
			cx: "4.5",
			cy: "9",
			r: "0.5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "9",
			r: "0.5"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "13.5",
			cy: "9",
			r: "0.5"
		})
	]
});
const ExternalLink = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M7.5 4.5 H4.5 V13.5 H13.5 V10.5" }),
		/* @__PURE__ */ jsx("path", { d: "M10.5 4.5 H13.5 V7.5" }),
		/* @__PURE__ */ jsx("path", { d: "M8.5 9.5 L13.5 4.5" })
	]
});
const Copy = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [/* @__PURE__ */ jsx("path", { d: "M6.5 6.5 V5 A1.5 1.5 0 0 1 8 3.5 H13 A1.5 1.5 0 0 1 14.5 5 V10 A1.5 1.5 0 0 1 13 11.5 H11.5" }), /* @__PURE__ */ jsx("path", { d: "M5 6.5 H10 A1.5 1.5 0 0 1 11.5 8 V13 A1.5 1.5 0 0 1 10 14.5 H5 A1.5 1.5 0 0 1 3.5 13 V8 A1.5 1.5 0 0 1 5 6.5 Z" })]
});
const AlertTriangle = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M9 3.5 L15.5 14.5 H2.5 Z" }),
		/* @__PURE__ */ jsx("path", { d: "M9 7 V10" }),
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "12.25",
			r: "0.5"
		})
	]
});
const InfoCircle = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "9",
			r: "6.5"
		}),
		/* @__PURE__ */ jsx("path", { d: "M9 8.5 V12.5" }),
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "6",
			r: "0.5"
		})
	]
});
const CircleCheck = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "9",
		cy: "9",
		r: "6.5"
	}), /* @__PURE__ */ jsx("path", { d: "M6 9.5 L8 11.5 L12 6.5" })]
});
const Calendar = (props) => /* @__PURE__ */ jsxs(Icon, {
	...props,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M4.5 4.5 H13.5 A1.5 1.5 0 0 1 15 6 V13.5 A1.5 1.5 0 0 1 13.5 15 H4.5 A1.5 1.5 0 0 1 3 13.5 V6 A1.5 1.5 0 0 1 4.5 4.5 Z" }),
		/* @__PURE__ */ jsx("path", { d: "M3 8 H15" }),
		/* @__PURE__ */ jsx("path", { d: "M6.5 3 V6" }),
		/* @__PURE__ */ jsx("path", { d: "M11.5 3 V6" })
	]
});
const Filter = (props) => /* @__PURE__ */ jsx(Icon, {
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M2.5 4 H15.5 L10.5 10 V14.5 L7.5 12.5 V10 Z" })
});
//#endregion
//#region src/data/filter-bar.tsx
function FilterBar({ filters, onRemove, onClearAll, className, ...rest }) {
	if (filters.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-wrap items-center gap-2", className),
		...rest,
		children: [/* @__PURE__ */ jsx("ul", {
			"aria-label": "Active filters",
			className: "flex flex-wrap items-center gap-2",
			children: filters.map((filter) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				"aria-label": `Remove filter ${filter.label}: ${filter.value}`,
				onClick: () => onRemove(filter.id),
				className: "flex items-center gap-1.5 rounded-lg border border-default bg-secondary px-2 py-1 text-mono-sm text-default transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-tertiary",
						children: filter.label
					}),
					filter.value,
					/* @__PURE__ */ jsx(Close, { className: "text-tertiary" })
				]
			}) }, filter.id))
		}), onClearAll && /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: onClearAll,
			className: "rounded-lg px-2 py-1 text-mono-sm text-secondary transition-colors hover:bg-hover hover:text-default focus-visible:outline-2 focus-visible:outline-accent",
			children: "Clear all"
		})]
	});
}
//#endregion
//#region src/lib/clamp.ts
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
//#endregion
//#region src/primitives/avatar.tsx
const BASE$3 = "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full";
const SIZE$4 = {
	xs: "h-5 w-5 text-mono-xs",
	sm: "h-6 w-6 text-mono-xs",
	base: "h-8 w-8 text-mono-sm",
	lg: "h-10 w-10 text-mono-md"
};
const TINT$1 = [
	"bg-green-200 text-green-800 light:bg-green-1200 light:text-green-500",
	"bg-blue-200 text-blue-800 light:bg-blue-1200 light:text-blue-500",
	"bg-purple-200 text-purple-800 light:bg-purple-1200 light:text-purple-500",
	"bg-yellow-200 text-yellow-800 light:bg-yellow-1200 light:text-yellow-500",
	"bg-red-200 text-red-800 light:bg-red-1200 light:text-red-500"
];
/** First and last word, so a middle name never displaces the surname. */
function avatarInitials(name) {
	const words = name.trim().split(/\s+/).filter(Boolean);
	return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1]?.[0] ?? "" : "")).toUpperCase();
}
/** Hashed rather than cycled by index so a person keeps their colour wherever
*  they appear, with no shared counter between call sites. */
function avatarTint(name) {
	let hash = 0;
	for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 100003;
	return TINT$1[hash % TINT$1.length] ?? TINT$1[0];
}
function Avatar({ name, src, size = "base", className, ...rest }) {
	const [failedSrc, setFailedSrc] = useState();
	if (src !== void 0 && src !== failedSrc) return /* @__PURE__ */ jsx("span", {
		className: cn(BASE$3, SIZE$4[size], className),
		...rest,
		children: /* @__PURE__ */ jsx("img", {
			src,
			alt: name,
			className: "h-full w-full object-cover",
			onError: () => setFailedSrc(src)
		})
	});
	return /* @__PURE__ */ jsx("span", {
		role: "img",
		"aria-label": name,
		className: cn(BASE$3, SIZE$4[size], avatarTint(name), className),
		...rest,
		children: avatarInitials(name)
	});
}
//#endregion
//#region src/primitives/badge.tsx
/** Success is the one hue with no semantic surface — accent is swappable and would
*  drag "success" along with it — so it pins the raw green scale per theme. */
const VARIANT$1 = {
	default: "bg-secondary text-default",
	accent: "bg-accent text-accent",
	success: "bg-green-200 text-green-800 light:bg-green-1200 light:text-green-500",
	notice: "bg-notice text-notice",
	error: "bg-error text-error",
	info: "bg-info text-info",
	neutral: "bg-tertiary text-tertiary"
};
const SIZE$3 = {
	sm: "h-4 gap-1 px-1",
	base: "h-5 gap-1 px-1.5"
};
function Badge({ variant = "default", size = "base", className, ...rest }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("inline-flex items-center whitespace-nowrap rounded-sm text-mono-xs", VARIANT$1[variant], SIZE$3[size], className),
		...rest
	});
}
//#endregion
//#region src/primitives/spinner.tsx
const SIZE$2 = {
	sm: "h-3 w-3",
	base: "h-4 w-4",
	lg: "h-6 w-6"
};
function Spinner({ size = "base", label = "Loading", className, ...rest }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 18 18",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		role: "status",
		"aria-label": label,
		className: cn("animate-spin motion-reduce:animate-none", SIZE$2[size], className),
		...rest,
		children: [/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "9",
			r: "7",
			opacity: .25
		}), /* @__PURE__ */ jsx("path", { d: "M9 2A7 7 0 0 1 16 9" })]
	});
}
//#endregion
//#region src/primitives/button.tsx
const BASE$2 = "relative inline-flex select-none items-center justify-center gap-2 rounded-lg text-mono-sm transition-colors active:translate-y-px motion-reduce:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-not-allowed";
/** `enabled:` guards the hover fill: `:hover` still matches a disabled button, and
*  the disabled treatment dims the label only — the fill must stay put. */
const VARIANT = {
	primary: "bg-accent text-accent enabled:hover:bg-accent-hover disabled:text-accent-disabled",
	secondary: "bg-secondary text-secondary enabled:hover:bg-hover disabled:text-disabled",
	ghost: "bg-transparent text-secondary enabled:hover:bg-hover disabled:text-disabled",
	danger: "bg-destructive text-destructive enabled:hover:bg-error-hover disabled:text-destructive-disabled",
	notice: "bg-notice text-notice enabled:hover:bg-notice-hover disabled:text-notice-disabled"
};
const SIZE$1 = {
	sm: "h-8 px-3",
	base: "h-10 px-4"
};
const SQUARE = {
	sm: "h-8 w-8",
	base: "h-10 w-10"
};
function Button({ variant = "primary", size = "base", loading = false, type = "button", disabled, className, children, ...rest }) {
	return /* @__PURE__ */ jsx("button", {
		type,
		disabled: disabled || loading,
		"aria-busy": loading || void 0,
		className: cn(BASE$2, VARIANT[variant], SIZE$1[size], className),
		...rest,
		children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Spinner, {
			size,
			className: "absolute inset-0 m-auto"
		}), /* @__PURE__ */ jsx("span", {
			className: "invisible inline-flex items-center gap-2",
			children
		})] }) : children
	});
}
function IconButton({ variant = "primary", size = "base", loading = false, type = "button", disabled, className, children, ...rest }) {
	return /* @__PURE__ */ jsx("button", {
		type,
		disabled: disabled || loading,
		"aria-busy": loading || void 0,
		className: cn(BASE$2, VARIANT[variant], SQUARE[size], className),
		...rest,
		children: loading ? /* @__PURE__ */ jsx(Spinner, { size }) : children
	});
}
//#endregion
//#region src/primitives/card.tsx
function Card({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("rounded-lg border border-default bg-raise", className),
		...rest
	});
}
function CardHeader({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex items-center justify-between gap-3 border-b border-secondary px-4 py-3", className),
		...rest
	});
}
function CardTitle({ className, ...rest }) {
	return /* @__PURE__ */ jsx("h3", {
		className: cn("m-0 text-sans-semi-md text-raise", className),
		...rest
	});
}
function CardBody({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("px-4 py-3 text-sans-md text-secondary", className),
		...rest
	});
}
function CardFooter({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex items-center justify-end gap-2 border-t border-secondary px-4 py-3", className),
		...rest
	});
}
//#endregion
//#region src/primitives/copy-button.tsx
function CopyButton({ value, label = "Copy", copiedLabel = "Copied", ...rest }) {
	/** A timestamp rather than a flag so copying again mid-flash restarts the
	*  countdown instead of inheriting the tail of the previous one. */
	const [copiedAt, setCopiedAt] = useState(0);
	const copied = copiedAt !== 0;
	useEffect(() => {
		if (copiedAt === 0) return;
		const timer = setTimeout(() => setCopiedAt(0), 1500);
		return () => clearTimeout(timer);
	}, [copiedAt]);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			return;
		}
		setCopiedAt(Date.now());
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(IconButton, {
		variant: "ghost",
		size: "sm",
		...rest,
		"aria-label": copied ? copiedLabel : label,
		onClick: () => void copy(),
		children: copied ? /* @__PURE__ */ jsx("span", {
			className: "text-accent",
			children: /* @__PURE__ */ jsx(Check, {})
		}) : /* @__PURE__ */ jsx(Copy, {})
	}), /* @__PURE__ */ jsx("span", {
		"aria-live": "polite",
		className: "sr-only",
		children: copied ? copiedLabel : ""
	})] });
}
//#endregion
//#region src/primitives/divider.tsx
/** `<hr>` already means separator, so the role is implicit. Each orientation names
*  both edges it touches — `border-0` plus `border-t` would race on precedence. */
const ORIENTATION = {
	horizontal: "w-full border-t",
	vertical: "h-full border-t-0 border-l"
};
function Divider({ orientation = "horizontal", className, ...rest }) {
	return /* @__PURE__ */ jsx("hr", {
		...rest,
		"aria-orientation": orientation,
		className: cn("border-secondary", ORIENTATION[orientation], className)
	});
}
//#endregion
//#region src/primitives/kbd.tsx
function Kbd({ className, ...rest }) {
	return /* @__PURE__ */ jsx("kbd", {
		className: cn("inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-default bg-secondary px-1 text-mono-xs text-secondary", className),
		...rest
	});
}
//#endregion
//#region src/primitives/progress-bar.tsx
const TRACK$1 = "w-full overflow-hidden rounded-full bg-secondary";
const FILL = "h-full rounded-full transition-[width] motion-reduce:transition-none";
const HEIGHT = {
	sm: "h-1",
	base: "h-2"
};
function ProgressBar({ value, size = "base", label, className, ...rest }) {
	const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
	return /* @__PURE__ */ jsx("div", {
		...rest,
		role: "progressbar",
		"aria-valuenow": percent,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": label,
		className: cn(TRACK$1, HEIGHT[size], className),
		children: /* @__PURE__ */ jsx("div", {
			className: cn(FILL, "bg-accent-inverse"),
			style: { width: `${percent}%` }
		})
	});
}
/** A meter reads as consumption, not progress, so the fill escalates with the
*  value instead of holding one colour. */
function MeterBar({ value, size = "base", label, className, ...rest }) {
	const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
	const fill = percent > 90 ? "bg-error-inverse" : percent >= 75 ? "bg-notice-inverse" : "bg-accent-inverse";
	return /* @__PURE__ */ jsx("div", {
		...rest,
		role: "meter",
		"aria-valuenow": percent,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": label,
		className: cn(TRACK$1, HEIGHT[size], className),
		children: /* @__PURE__ */ jsx("div", {
			className: cn(FILL, fill),
			style: { width: `${percent}%` }
		})
	});
}
//#endregion
//#region src/primitives/skeleton.tsx
/** Carries no intrinsic size: every placeholder is shaped by the caller's
*  `className`, since a baked-in height would fight it on class precedence. */
function Skeleton({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": true,
		className: cn("animate-pulse rounded bg-secondary motion-reduce:animate-none", className),
		...rest
	});
}
//#endregion
//#region src/data/pagination.tsx
const MAX_SLOTS = 7;
const PAGE_SIZES = [
	10,
	25,
	50,
	100
];
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, offset) => from + offset);
/** Once `pageCount` exceeds MAX_SLOTS the result is always exactly MAX_SLOTS
*  long, so the control keeps a stable width while the user pages through.
*  Each ellipsis stands in for at least two pages, never one. */
function paginationWindow(page, pageCount) {
	if (pageCount < 1) return [];
	if (pageCount <= MAX_SLOTS) return range(1, pageCount);
	const current = clamp(Math.trunc(page), 1, pageCount);
	const gapAfterFirst = current > 4;
	const gapBeforeLast = current < pageCount - 3;
	if (!gapAfterFirst) return [
		...range(1, 5),
		"ellipsis-end",
		pageCount
	];
	if (!gapBeforeLast) return [
		1,
		"ellipsis-start",
		...range(pageCount - 4, pageCount)
	];
	return [
		1,
		"ellipsis-start",
		current - 1,
		current,
		current + 1,
		"ellipsis-end",
		pageCount
	];
}
const PageSizeSelect = ({ value, onChange }) => {
	const options = PAGE_SIZES.includes(value) ? PAGE_SIZES : [...PAGE_SIZES, value].sort((a, b) => a - b);
	return /* @__PURE__ */ jsxs("label", {
		className: "flex items-center gap-1.5 text-tertiary",
		children: ["Rows", /* @__PURE__ */ jsx("select", {
			value,
			onChange: (event) => onChange(Number(event.target.value)),
			className: "rounded-lg border border-default bg-raise px-1.5 py-0.5 text-mono-sm text-default focus-visible:outline-2 focus-visible:outline-accent",
			children: options.map((option) => /* @__PURE__ */ jsx("option", {
				value: option,
				children: option
			}, option))
		})]
	});
};
function Pagination({ page, pageCount, onPageChange, pageSize, onPageSizeChange, className, ...rest }) {
	if (pageCount < 1) return null;
	const current = clamp(Math.trunc(page), 1, pageCount);
	const slots = paginationWindow(current, pageCount);
	return /* @__PURE__ */ jsxs("nav", {
		"aria-label": "Pagination",
		className: cn("flex items-center gap-3 text-mono-sm", className),
		...rest,
		children: [pageSize !== void 0 && onPageSizeChange && /* @__PURE__ */ jsx(PageSizeSelect, {
			value: pageSize,
			onChange: onPageSizeChange
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ jsx(IconButton, {
					"aria-label": "Previous page",
					size: "sm",
					disabled: current <= 1,
					onClick: () => onPageChange(current - 1),
					children: /* @__PURE__ */ jsx(ChevronLeft, {})
				}),
				slots.map((slot) => typeof slot === "number" ? /* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-current": slot === current ? "page" : void 0,
					onClick: () => onPageChange(slot),
					className: cn("min-w-6 rounded-lg px-1.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent", slot === current ? "bg-accent-secondary text-accent" : "text-secondary hover:bg-hover hover:text-default"),
					children: slot
				}, slot) : /* @__PURE__ */ jsx("span", {
					"aria-hidden": true,
					className: "px-1 text-quaternary",
					children: "…"
				}, slot)),
				/* @__PURE__ */ jsx(IconButton, {
					"aria-label": "Next page",
					size: "sm",
					disabled: current >= pageCount,
					onClick: () => onPageChange(current + 1),
					children: /* @__PURE__ */ jsx(ChevronRight, {})
				})
			]
		})]
	});
}
//#endregion
//#region src/data/property-list.tsx
const COLUMNS = {
	1: "grid-cols-1",
	2: "grid-cols-1 sm:grid-cols-2"
};
function PropertyList({ columns = 1, className, ...rest }) {
	return /* @__PURE__ */ jsx("dl", {
		className: cn("grid gap-x-8 gap-y-4", COLUMNS[columns], className),
		...rest
	});
}
function PropertyItem({ label, children, className, ...rest }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("min-w-0", className),
		...rest,
		children: [/* @__PURE__ */ jsx("dt", {
			className: "text-mono-xs text-tertiary",
			children: label
		}), /* @__PURE__ */ jsx("dd", {
			className: "mt-1 min-w-0 break-words text-sans-14 text-default",
			children
		})]
	});
}
//#endregion
//#region src/data/table.tsx
const ARIA_SORT = {
	asc: "ascending",
	desc: "descending",
	none: "none"
};
const SKELETON_ROWS = [
	0,
	1,
	2,
	3,
	4
];
const NESTED_CONTROL = "a, button, input, select, textarea";
const fromNestedControl = (event) => event.target instanceof Element && event.target.closest(NESTED_CONTROL) !== null;
function Table({ data, columns, emptyState = "No results", loading = false, onRowClick, pinFirstColumn = false, getRowId, className }) {
	const [sorting, setSorting] = useState([]);
	const [atStart, setAtStart] = useState(true);
	const table = useReactTable({
		data,
		columns,
		getRowId,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
	const rows = table.getRowModel().rows;
	const leafColumns = table.getVisibleLeafColumns();
	return /* @__PURE__ */ jsx("div", {
		className: cn("overflow-auto scroll-thin", className),
		onScroll: pinFirstColumn ? (event) => setAtStart(event.currentTarget.scrollLeft <= 0) : void 0,
		children: /* @__PURE__ */ jsxs("table", {
			"aria-busy": loading,
			"data-at-start": pinFirstColumn ? String(atStart) : void 0,
			className: cn("w-full border-separate border-spacing-0", pinFirstColumn && "table-pinned"),
			children: [/* @__PURE__ */ jsx("thead", { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx("tr", { children: headerGroup.headers.map((header) => {
				const sortable = header.column.getCanSort();
				const sorted = header.column.getIsSorted();
				const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
				return /* @__PURE__ */ jsx("th", {
					colSpan: header.colSpan,
					scope: "col",
					"aria-sort": sortable ? ARIA_SORT[sorted || "none"] : void 0,
					className: "sticky top-0 z-20 border-b border-default bg-default px-3 py-2 text-left text-mono-xs text-tertiary",
					children: sortable ? /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: header.column.getToggleSortingHandler(),
						className: "flex items-center gap-1.5 text-mono-xs text-tertiary transition-colors hover:text-default focus-visible:outline-2 focus-visible:outline-accent",
						children: [content, sorted === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { className: "text-default" }) : /* @__PURE__ */ jsx(ChevronDown, { className: sorted ? "text-default" : "text-quaternary" })]
					}) : content
				}, header.id);
			}) }, headerGroup.id)) }), /* @__PURE__ */ jsxs("tbody", { children: [
				loading && SKELETON_ROWS.map((slot) => /* @__PURE__ */ jsx("tr", { children: leafColumns.map((column) => /* @__PURE__ */ jsx("td", {
					className: "border-b border-secondary px-3 py-2",
					children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" })
				}, column.id)) }, slot)),
				!loading && rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: leafColumns.length,
					className: "px-3 py-10 text-center text-sans-14 text-secondary",
					children: emptyState
				}) }),
				!loading && rows.map((row) => /* @__PURE__ */ jsx("tr", {
					role: onRowClick ? "button" : void 0,
					tabIndex: onRowClick ? 0 : void 0,
					onClick: onRowClick && ((event) => {
						if (!fromNestedControl(event)) onRowClick(row.original);
					}),
					onKeyDown: onRowClick && ((event) => {
						if (event.key !== "Enter" && event.key !== " ") return;
						if (fromNestedControl(event)) return;
						event.preventDefault();
						onRowClick(row.original);
					}),
					className: cn("text-sans-14 text-default", !pinFirstColumn && "hover:bg-hover", onRowClick && "cursor-pointer focus-visible:outline-none", onRowClick && !pinFirstColumn && "focus-visible:bg-accent-secondary"),
					children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx("td", {
						className: "border-b border-secondary px-3 py-2 align-middle",
						children: flexRender(cell.column.columnDef.cell, cell.getContext())
					}, cell.id))
				}, row.id))
			] })]
		})
	});
}
//#endregion
//#region src/feedback/state-parts.tsx
/** Shared, internal shell and text atoms for the centred states — `EmptyState`
*  and `ErrorState`. Not exported from the folder barrel: not public API. */
function CenteredState({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className),
		...rest
	});
}
function StateTitle({ children }) {
	return /* @__PURE__ */ jsx("p", {
		className: "text-default text-sans-semi-md",
		children
	});
}
function StateDescription({ children }) {
	return /* @__PURE__ */ jsx("p", {
		className: "max-w-prose text-sans-14 text-tertiary",
		children
	});
}
//#endregion
//#region src/feedback/empty-state.tsx
function EmptyState({ title, description, icon, action, ...rest }) {
	return /* @__PURE__ */ jsxs(CenteredState, {
		...rest,
		children: [
			icon ? /* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				className: "mb-1 text-quaternary text-sans-28",
				children: icon
			}) : null,
			/* @__PURE__ */ jsx(StateTitle, { children: title }),
			description ? /* @__PURE__ */ jsx(StateDescription, { children: description }) : null,
			action ? /* @__PURE__ */ jsx("div", {
				className: "mt-4",
				children: action
			}) : null
		]
	});
}
//#endregion
//#region src/feedback/error-state.tsx
/** A thrown value may carry a query, a stack or a token, so it is only ever
*  reachable through `showDetails` — never through the visible copy. */
function describeError(error) {
	if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error, null, 2) ?? String(error);
	} catch {
		return "This value could not be displayed.";
	}
}
function ErrorState({ title = "Something went wrong", description = "This content could not be loaded. Try again in a moment.", error, showDetails = false, onRetry, ...rest }) {
	return /* @__PURE__ */ jsxs(CenteredState, {
		...rest,
		children: [
			/* @__PURE__ */ jsx(AlertTriangle, {
				"aria-hidden": true,
				className: "mb-1 text-error text-sans-28"
			}),
			/* @__PURE__ */ jsx(StateTitle, { children: title }),
			/* @__PURE__ */ jsx(StateDescription, { children: description }),
			onRetry ? /* @__PURE__ */ jsx(Button, {
				className: "mt-4",
				onClick: onRetry,
				size: "sm",
				variant: "secondary",
				children: "Retry"
			}) : null,
			showDetails && error !== void 0 ? /* @__PURE__ */ jsxs("details", {
				className: "mt-6 w-full max-w-prose text-left",
				children: [/* @__PURE__ */ jsx("summary", {
					className: "cursor-pointer text-mono-xs text-quaternary",
					children: "Technical detail"
				}), /* @__PURE__ */ jsx("pre", {
					className: "mt-2 max-h-48 overflow-auto rounded-lg bg-secondary p-3 text-mono-code text-secondary scroll-thin",
					children: describeError(error)
				})]
			}) : null
		]
	});
}
//#endregion
//#region src/feedback/loading-overlay.tsx
function LoadingOverlay({ active, label = "Loading", className }) {
	const reduced = useReducedMotion();
	if (!active) return null;
	return /* @__PURE__ */ jsx(motion.div, {
		animate: { opacity: 1 },
		className: cn("absolute inset-0 z-10 flex items-center justify-center bg-scrim", className),
		initial: { opacity: reduced ? 1 : 0 },
		ref: (node) => {
			const host = node?.parentElement;
			if (!host) return;
			const previous = host.getAttribute("aria-busy");
			host.setAttribute("aria-busy", "true");
			return () => {
				if (previous === null) host.removeAttribute("aria-busy");
				else host.setAttribute("aria-busy", previous);
			};
		},
		transition: { duration: reduced ? 0 : .15 },
		children: /* @__PURE__ */ jsx(Spinner, {
			className: "text-secondary",
			label,
			size: "lg"
		})
	});
}
//#endregion
//#region src/feedback/route-progress.tsx
const TRAVEL = {
	idle: {
		scaleX: 0,
		opacity: 0,
		transition: { duration: 0 }
	},
	loading: {
		scaleX: .45,
		opacity: 1,
		transition: {
			scaleX: {
				duration: 1.4,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			opacity: { duration: .1 }
		}
	},
	done: {
		scaleX: 1,
		opacity: 0,
		transition: {
			scaleX: {
				duration: .2,
				ease: "easeOut"
			},
			opacity: {
				duration: .25,
				delay: .2
			}
		}
	}
};
/** Reduced motion holds the bar at full width and pulses it, so the eye is never
*  dragged across the viewport. */
const PULSE = {
	idle: {
		scaleX: 1,
		opacity: 0,
		transition: { duration: 0 }
	},
	loading: {
		scaleX: 1,
		opacity: [.25, 1],
		transition: {
			duration: 1,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "reverse"
		}
	},
	done: {
		scaleX: 1,
		opacity: 0,
		transition: { duration: .2 }
	}
};
const ANNOUNCEMENT = {
	idle: "",
	loading: "Loading page",
	done: "Page loaded"
};
function RouteProgress({ active, className }) {
	const [phase, setPhase] = useState("idle");
	const reduced = useReducedMotion();
	useEffect(() => {
		setPhase((current) => active ? "loading" : current === "loading" ? "done" : current);
	}, [active]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
		animate: (reduced ? PULSE : TRAVEL)[phase],
		"aria-hidden": true,
		className: cn("pointer-events-none fixed top-0 left-0 z-[var(--z-toast)] h-0.5 w-full origin-left transform-gpu bg-accent-inverse", className),
		"data-phase": phase,
		initial: false
	}), /* @__PURE__ */ jsx("span", {
		"aria-live": "polite",
		className: "sr-only",
		children: ANNOUNCEMENT[phase]
	})] });
}
//#endregion
//#region src/lib/use-controllable.ts
function useControllable(value, defaultValue, onChange) {
	const [internal, setInternal] = useState(defaultValue);
	const controlled = value !== void 0;
	const set = useCallback((next) => {
		if (!controlled) setInternal(next);
		onChange?.(next);
	}, [controlled, onChange]);
	return [controlled ? value : internal, set];
}
//#endregion
//#region src/forms/field.tsx
const CONTROL_BASE = "w-full rounded-lg border bg-default text-sans-14 text-default transition-colors placeholder:text-quaternary focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled";
const controlBorder = (invalid) => invalid ? "border-error" : "border-default enabled:hover:border-raise";
const inlineLabel = (disabled) => cn("text-sans-14", disabled ? "text-disabled" : "text-default");
function useFieldIds(description, error) {
	const uid = useId();
	const descriptionId = description ? `${uid}-description` : void 0;
	const errorId = error ? `${uid}-error` : void 0;
	return {
		id: `${uid}-control`,
		labelId: `${uid}-label`,
		descriptionId,
		errorId,
		describedBy: [descriptionId, errorId].filter(Boolean).join(" ") || void 0,
		invalid: Boolean(error)
	};
}
function RequiredMark() {
	return /* @__PURE__ */ jsx("span", {
		"aria-hidden": "true",
		className: "text-error",
		children: "*"
	});
}
function FieldDescription({ id, children }) {
	return /* @__PURE__ */ jsx("span", {
		id,
		className: "text-sans-12 text-tertiary",
		children
	});
}
function FieldError({ id, children }) {
	return /* @__PURE__ */ jsx("span", {
		id,
		className: "text-sans-12 text-error",
		children
	});
}
function Field({ label, description, error, required, group, className, children }) {
	const control = useFieldIds(description, error);
	const heading = "text-mono-sm text-default";
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex w-full flex-col gap-1.5", className),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [group ? /* @__PURE__ */ jsx("span", {
					id: control.labelId,
					className: heading,
					children: label
				}) : /* @__PURE__ */ jsx(Label.Root, {
					id: control.labelId,
					htmlFor: control.id,
					className: heading,
					children: label
				}), required && /* @__PURE__ */ jsx(RequiredMark, {})]
			}),
			description && /* @__PURE__ */ jsx(FieldDescription, {
				id: control.descriptionId,
				children: description
			}),
			children(control),
			error && /* @__PURE__ */ jsx(FieldError, {
				id: control.errorId,
				children: error
			})
		]
	});
}
function InlineField({ label, description, error, required, disabled, indent, children }) {
	const control = useFieldIds(description, error);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				children(control),
				/* @__PURE__ */ jsx(Label.Root, {
					htmlFor: control.id,
					className: inlineLabel(disabled),
					children: label
				}),
				required && /* @__PURE__ */ jsx(RequiredMark, {})
			]
		}), (description || error) && /* @__PURE__ */ jsxs("div", {
			className: cn("flex flex-col gap-1", indent),
			children: [description && /* @__PURE__ */ jsx(FieldDescription, {
				id: control.descriptionId,
				children: description
			}), error && /* @__PURE__ */ jsx(FieldError, {
				id: control.errorId,
				children: error
			})]
		})]
	});
}
//#endregion
//#region src/forms/checkbox.tsx
const BOX = "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-sans-12 transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed";
function Checkbox({ label, description, error, checked, defaultChecked, onCheckedChange, disabled, className, ...rest }) {
	const [state, setState] = useControllable(checked, defaultChecked ?? false, onCheckedChange);
	const box = (invalid) => disabled ? "border-default bg-disabled text-disabled" : state === false ? cn("bg-default hover:border-raise", invalid ? "border-error" : "border-default") : "border-accent bg-accent-inverse text-inverse";
	return /* @__PURE__ */ jsx(InlineField, {
		label,
		description,
		error,
		required: rest.required,
		disabled,
		indent: "pl-6",
		children: ({ id, describedBy, errorId, invalid }) => /* @__PURE__ */ jsx(Checkbox$1.Root, {
			...rest,
			id,
			checked: state,
			onCheckedChange: setState,
			disabled,
			"aria-describedby": describedBy,
			"aria-errormessage": errorId,
			"aria-invalid": invalid || void 0,
			className: cn(BOX, box(invalid), className),
			children: /* @__PURE__ */ jsx(Checkbox$1.Indicator, {
				className: "flex",
				children: state === "indeterminate" ? /* @__PURE__ */ jsx(Minus, { "data-glyph": "minus" }) : /* @__PURE__ */ jsx(Check, { "data-glyph": "check" })
			})
		})
	});
}
//#endregion
//#region src/forms/text-field.tsx
const SLOT = "absolute inset-y-0 flex w-9 items-center justify-center text-tertiary";
function TextField({ label, description, error, leading, trailing, className, ...rest }) {
	return /* @__PURE__ */ jsx(Field, {
		label,
		description,
		error,
		required: rest.required,
		children: ({ id, describedBy, errorId, invalid }) => /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [
				leading && /* @__PURE__ */ jsx("span", {
					className: cn(SLOT, "left-0"),
					children: leading
				}),
				/* @__PURE__ */ jsx("input", {
					...rest,
					id,
					"aria-describedby": describedBy,
					"aria-errormessage": errorId,
					"aria-invalid": invalid || void 0,
					className: cn(CONTROL_BASE, controlBorder(invalid), "h-10", leading ? "pl-9" : "pl-3", trailing ? "pr-9" : "pr-3", className)
				}),
				trailing && /* @__PURE__ */ jsx("span", {
					className: cn(SLOT, "right-0"),
					children: trailing
				})
			]
		})
	});
}
//#endregion
//#region src/forms/number-field.tsx
function NumberField({ label, value, defaultValue, onValueChange, min, max, step = 1, disabled, className, ...rest }) {
	const lower = min ?? Number.NEGATIVE_INFINITY;
	const upper = max ?? Number.POSITIVE_INFINITY;
	const [current, setCurrent] = useControllable(value, defaultValue ?? min ?? 0, onValueChange);
	const [draft, setDraft] = useState(null);
	const commit = (next) => {
		const bounded = Math.min(upper, Math.max(lower, next));
		setCurrent(bounded);
		return bounded;
	};
	const nudge = (direction) => {
		setDraft(null);
		const decimals = (String(step).split(".")[1] ?? "").length;
		commit(Number((current + direction * step).toFixed(decimals)));
	};
	return /* @__PURE__ */ jsx(TextField, {
		...rest,
		label,
		disabled,
		role: "spinbutton",
		inputMode: "numeric",
		autoComplete: "off",
		"aria-valuenow": current,
		"aria-valuemin": min,
		"aria-valuemax": max,
		value: draft?.value === current ? draft.text : String(current),
		onChange: (event) => {
			const raw = event.target.value;
			const parsed = Number(raw);
			if (raw.trim() === "" || Number.isNaN(parsed)) {
				setDraft({
					text: raw,
					value: current
				});
				return;
			}
			const resolved = commit(parsed);
			setDraft(resolved === parsed ? {
				text: raw,
				value: resolved
			} : null);
		},
		onBlur: (event) => {
			setDraft(null);
			rest.onBlur?.(event);
		},
		onKeyDown: (event) => {
			rest.onKeyDown?.(event);
			if (event.key === "ArrowUp") {
				event.preventDefault();
				nudge(1);
			} else if (event.key === "ArrowDown") {
				event.preventDefault();
				nudge(-1);
			}
		},
		leading: /* @__PURE__ */ jsx(IconButton, {
			type: "button",
			"aria-label": `Decrease ${label}`,
			variant: "ghost",
			size: "sm",
			className: "text-sans-16",
			disabled: disabled || current <= lower,
			onClick: () => nudge(-1),
			children: /* @__PURE__ */ jsx(Minus, {})
		}),
		trailing: /* @__PURE__ */ jsx(IconButton, {
			type: "button",
			"aria-label": `Increase ${label}`,
			variant: "ghost",
			size: "sm",
			className: "text-sans-16",
			disabled: disabled || current >= upper,
			onClick: () => nudge(1),
			children: /* @__PURE__ */ jsx(Plus, {})
		}),
		className: cn("text-center", className)
	});
}
//#endregion
//#region src/forms/radio-group.tsx
function RadioGroup({ label, description, error, className, children, ...rest }) {
	return /* @__PURE__ */ jsx(Field, {
		label,
		description,
		error,
		required: rest.required,
		group: true,
		children: ({ labelId, describedBy, errorId, invalid }) => /* @__PURE__ */ jsx(RadioGroup$1.Root, {
			...rest,
			"aria-labelledby": labelId,
			"aria-describedby": describedBy,
			"aria-errormessage": errorId,
			"aria-invalid": invalid || void 0,
			className: cn("flex flex-col gap-2", className),
			children
		})
	});
}
const CIRCLE = "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-accent";
const CIRCLE_ENABLED = "data-[state=unchecked]:border-default data-[state=unchecked]:bg-default data-[state=unchecked]:hover:border-raise data-[state=checked]:border-accent data-[state=checked]:bg-accent-inverse";
function RadioGroupItem({ label, disabled, className, ...rest }) {
	const id = useId();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(RadioGroup$1.Item, {
			...rest,
			id,
			disabled,
			className: cn(CIRCLE, disabled ? "cursor-not-allowed border-default bg-disabled" : CIRCLE_ENABLED, className),
			children: /* @__PURE__ */ jsx(RadioGroup$1.Indicator, { className: "h-1.5 w-1.5 rounded-full bg-default" })
		}), /* @__PURE__ */ jsx(Label.Root, {
			htmlFor: id,
			className: inlineLabel(disabled),
			children: label
		})]
	});
}
//#endregion
//#region src/forms/select.tsx
const ITEM$1 = "flex h-8 cursor-default select-none items-center gap-2 rounded-md px-2 text-sans-14 text-default outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-disabled";
function Select({ label, options, placeholder, description, error, className, ref, ...rest }) {
	return /* @__PURE__ */ jsx(Field, {
		label,
		description,
		error,
		required: rest.required,
		children: ({ id, describedBy, errorId, invalid }) => /* @__PURE__ */ jsxs(Select$1.Root, {
			...rest,
			children: [/* @__PURE__ */ jsxs(Select$1.Trigger, {
				ref,
				id,
				"aria-describedby": describedBy,
				"aria-errormessage": errorId,
				"aria-invalid": invalid || void 0,
				className: cn(CONTROL_BASE, controlBorder(invalid), "flex h-10 items-center justify-between gap-2 px-3 text-left data-[placeholder]:text-quaternary", className),
				children: [/* @__PURE__ */ jsx(Select$1.Value, {
					className: "truncate",
					placeholder
				}), /* @__PURE__ */ jsx(Select$1.Icon, {
					className: "flex shrink-0 text-tertiary",
					children: /* @__PURE__ */ jsx(ChevronDown, {})
				})]
			}), /* @__PURE__ */ jsx(Select$1.Portal, { children: /* @__PURE__ */ jsx(Select$1.Content, {
				position: "popper",
				sideOffset: 4,
				className: "z-[var(--z-popover)] max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-y-auto scroll-thin rounded-lg border border-default bg-raise shadow-menu",
				children: /* @__PURE__ */ jsx(Select$1.Viewport, {
					className: "p-1",
					children: options.map((option) => /* @__PURE__ */ jsxs(Select$1.Item, {
						value: option.value,
						disabled: option.disabled,
						className: ITEM$1,
						children: [/* @__PURE__ */ jsx(Select$1.ItemText, { children: option.label }), /* @__PURE__ */ jsx(Select$1.ItemIndicator, {
							className: "ml-auto flex text-accent",
							children: /* @__PURE__ */ jsx(Check, {})
						})]
					}, option.value))
				})
			}) })]
		})
	});
}
//#endregion
//#region src/forms/switch.tsx
const TRACK = "flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed";
function Switch({ label, description, error, disabled, className, ...rest }) {
	return /* @__PURE__ */ jsx(InlineField, {
		label,
		description,
		error,
		required: rest.required,
		disabled,
		indent: "pl-11",
		children: ({ id, describedBy, errorId, invalid }) => /* @__PURE__ */ jsx(Switch$1.Root, {
			...rest,
			id,
			disabled,
			"aria-describedby": describedBy,
			"aria-errormessage": errorId,
			"aria-invalid": invalid || void 0,
			className: cn(TRACK, disabled ? "bg-disabled" : "data-[state=unchecked]:bg-tertiary data-[state=checked]:bg-accent-inverse", invalid && "ring-2 ring-error", className),
			children: /* @__PURE__ */ jsx(Switch$1.Thumb, { className: "ml-0.5 block h-4 w-4 rounded-full bg-inverse transition-transform data-[state=checked]:translate-x-4" })
		})
	});
}
//#endregion
//#region src/forms/textarea.tsx
function Textarea({ label, description, error, className, rows = 4, ...rest }) {
	return /* @__PURE__ */ jsx(Field, {
		label,
		description,
		error,
		required: rest.required,
		children: ({ id, describedBy, errorId, invalid }) => /* @__PURE__ */ jsx("textarea", {
			...rest,
			id,
			rows,
			"aria-describedby": describedBy,
			"aria-errormessage": errorId,
			"aria-invalid": invalid || void 0,
			className: cn(CONTROL_BASE, controlBorder(invalid), "min-h-20 resize-y scroll-thin px-3 py-2", className)
		})
	});
}
//#endregion
//#region src/lib/provider.tsx
const AnchorLink = ({ to, ...rest }) => /* @__PURE__ */ jsx("a", {
	href: to,
	...rest
});
const LinkContext = createContext(AnchorLink);
function OxideProvider({ link = AnchorLink, children }) {
	return /* @__PURE__ */ jsx(LinkContext, {
		value: link,
		children
	});
}
const useLink = () => use(LinkContext);
//#endregion
//#region src/navigation/app-shell.tsx
const SKIP = "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:rounded-lg focus:bg-raise focus:px-3 focus:py-2 focus:text-mono-sm focus:text-default focus:shadow-modal";
function AppShell({ sidebar, topBar, children, className, ...rest }) {
	const mainId = useId();
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative flex h-dvh w-full overflow-hidden bg-default", className),
		...rest,
		children: [
			/* @__PURE__ */ jsx("a", {
				href: `#${mainId}`,
				className: SKIP,
				children: "Skip to content"
			}),
			sidebar,
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [topBar, /* @__PURE__ */ jsx("main", {
					id: mainId,
					tabIndex: -1,
					className: "min-h-0 flex-1 overflow-y-auto p-6 scroll-thin",
					children
				})]
			})
		]
	});
}
//#endregion
//#region src/navigation/breadcrumbs.tsx
const MAX_VISIBLE = 4;
function Crumb({ item, current }) {
	const Link = useLink();
	if (current) return /* @__PURE__ */ jsx("span", {
		"aria-current": "page",
		className: "text-default",
		children: item.label
	});
	if (!item.to) return /* @__PURE__ */ jsx("span", {
		className: "text-secondary",
		children: item.label
	});
	return /* @__PURE__ */ jsx(Link, {
		to: item.to,
		className: "text-secondary transition hover:text-default",
		children: item.label
	});
}
function Breadcrumbs({ items, className, ...rest }) {
	const trail = items.length > MAX_VISIBLE ? [
		...items.slice(0, 1),
		null,
		...items.slice(-2)
	] : items;
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": "Breadcrumb",
		className,
		...rest,
		children: /* @__PURE__ */ jsx("ol", {
			className: "flex flex-wrap items-center gap-1.5 text-sans-12",
			children: trail.map((item, i) => /* @__PURE__ */ jsxs("li", {
				className: "flex items-center gap-1.5",
				children: [i > 0 && /* @__PURE__ */ jsx(ChevronRight, {
					"aria-hidden": "true",
					className: "shrink-0 text-quaternary"
				}), item ? /* @__PURE__ */ jsx(Crumb, {
					item,
					current: i === trail.length - 1
				}) : /* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					className: "text-tertiary",
					children: "…"
				})]
			}, item ? `${item.to ?? ""}/${item.label}` : "collapsed"))
		})
	});
}
//#endregion
//#region src/navigation/nav-item.tsx
const BASE$1 = "inline-flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sans-14 transition";
const RESTING = "text-secondary hover:bg-hover hover:text-default";
const ACTIVE = "bg-accent text-accent";
function NavItem({ to, children, icon, badge, active, className }) {
	const Link = useLink();
	return /* @__PURE__ */ jsxs(Link, {
		to,
		"aria-current": active ? "page" : void 0,
		className: cn(BASE$1, active ? ACTIVE : RESTING, className),
		children: [
			icon && /* @__PURE__ */ jsx("span", {
				className: "flex shrink-0 items-center",
				children: icon
			}),
			/* @__PURE__ */ jsx("span", {
				className: "truncate",
				children
			}),
			badge && /* @__PURE__ */ jsx("span", {
				className: "ml-auto flex shrink-0 items-center",
				children: badge
			})
		]
	});
}
//#endregion
//#region src/navigation/page-header.tsx
function PageHeader({ title, description, actions, breadcrumbs, className, ...rest }) {
	return /* @__PURE__ */ jsxs("header", {
		className: cn("flex flex-col gap-3", className),
		...rest,
		children: [breadcrumbs && /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbs }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-start justify-between gap-x-4 gap-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "heading-md",
					children: title
				}), description && /* @__PURE__ */ jsx("p", {
					className: "text-secondary text-sans-14",
					children: description
				})]
			}), actions && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap items-center gap-2",
				children: actions
			})]
		})]
	});
}
//#endregion
//#region src/navigation/sidebar.tsx
const SIDEBAR = "flex h-full w-[var(--sidebar-width)] shrink-0 flex-col gap-5 overflow-y-auto border-default border-r bg-default py-4 scroll-thin";
function Sidebar({ className, "aria-label": label = "Main", ...rest }) {
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": label,
		className: cn(SIDEBAR, className),
		...rest
	});
}
function SidebarSection({ title, children, className, ...rest }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col gap-0.5 px-2", className),
		...rest,
		children: [title && /* @__PURE__ */ jsx("div", {
			className: "px-2 pb-1 text-mono-xs text-tertiary",
			children: title
		}), children]
	});
}
function SidebarFooter({ className, ...rest }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("mt-auto flex flex-col gap-0.5 border-default border-t px-2 pt-4", className),
		...rest
	});
}
//#endregion
//#region src/navigation/tabs.tsx
/** The negative bottom margin drops the trigger onto the list's border so the
*  active inset shadow replaces that 1px rather than stacking above it. */
const TRIGGER = "-mb-px h-9 px-3 text-mono-sm text-secondary transition hover:text-default data-[state=active]:text-accent data-[state=active]:shadow-[inset_0_-2px_0_0_var(--stroke-accent)]";
function Tabs({ items, className, defaultValue, "aria-label": label, ...rest }) {
	return /* @__PURE__ */ jsxs(Tabs$1.Root, {
		defaultValue: defaultValue ?? items[0]?.value,
		className: cn("flex flex-col", className),
		...rest,
		children: [/* @__PURE__ */ jsx(Tabs$1.List, {
			"aria-label": label,
			className: "flex items-end gap-1 border-default border-b",
			children: items.map((item) => /* @__PURE__ */ jsx(Tabs$1.Trigger, {
				value: item.value,
				className: TRIGGER,
				children: item.label
			}, item.value))
		}), items.map((item) => /* @__PURE__ */ jsx(Tabs$1.Content, {
			value: item.value,
			className: "pt-4",
			children: item.content
		}, item.value))]
	});
}
//#endregion
//#region src/navigation/top-bar.tsx
const TOP_BAR = "sticky top-0 z-[var(--z-top-bar)] flex h-[var(--top-bar-height)] shrink-0 items-center justify-between gap-3 border-default border-b bg-default px-4";
function TopBar({ leading, trailing, children, className, ...rest }) {
	return /* @__PURE__ */ jsxs("header", {
		className: cn(TOP_BAR, className),
		...rest,
		children: [
			leading && /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 items-center gap-2",
				children: leading
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children
			}),
			trailing && /* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 items-center gap-2",
				children: trailing
			})
		]
	});
}
//#endregion
//#region src/overlays/menu.tsx
const CONTENT$4 = "z-[var(--z-popover)] min-w-44 max-h-[var(--radix-dropdown-menu-content-available-height)] scroll-thin overflow-y-auto rounded-lg border border-default bg-raise p-1 shadow-menu origin-[var(--radix-dropdown-menu-content-transform-origin)] transition-[opacity,scale] duration-100 ease-out starting:scale-95 starting:opacity-0";
const ITEM = "flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sans-12 outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-disabled";
function Menu({ trigger, open, defaultOpen, onOpenChange, align = "start", sideOffset = 6, collisionPadding = 8, className, children, ...rest }) {
	return /* @__PURE__ */ jsxs(DropdownMenu.Root, {
		open,
		defaultOpen,
		onOpenChange,
		children: [/* @__PURE__ */ jsx(DropdownMenu.Trigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsx(DropdownMenu.Portal, { children: /* @__PURE__ */ jsx(DropdownMenu.Content, {
			align,
			sideOffset,
			collisionPadding,
			className: cn(CONTENT$4, className),
			...rest,
			children
		}) })]
	});
}
const MenuItem = ({ icon, shortcut, destructive = false, className, children, ...rest }) => /* @__PURE__ */ jsxs(DropdownMenu.Item, {
	className: cn(ITEM, destructive ? "text-error" : "text-default", className),
	...rest,
	children: [
		icon ? /* @__PURE__ */ jsx("span", {
			className: "flex size-4 shrink-0 items-center justify-center",
			children: icon
		}) : null,
		/* @__PURE__ */ jsx("span", {
			className: "min-w-0 flex-1 truncate",
			children
		}),
		shortcut ? /* @__PURE__ */ jsx(Kbd, {
			className: "ml-2 shrink-0 text-tertiary",
			children: shortcut
		}) : null
	]
});
const MenuCheckboxItem = ({ shortcut, className, children, ...rest }) => /* @__PURE__ */ jsxs(DropdownMenu.CheckboxItem, {
	className: cn(ITEM, "text-default", className),
	...rest,
	children: [
		/* @__PURE__ */ jsx("span", {
			className: "flex size-4 shrink-0 items-center justify-center",
			children: /* @__PURE__ */ jsx(DropdownMenu.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-accent" }) })
		}),
		/* @__PURE__ */ jsx("span", {
			className: "min-w-0 flex-1 truncate",
			children
		}),
		shortcut ? /* @__PURE__ */ jsx(Kbd, {
			className: "ml-2 shrink-0 text-tertiary",
			children: shortcut
		}) : null
	]
});
const MenuSeparator = ({ className, ...rest }) => /* @__PURE__ */ jsx(DropdownMenu.Separator, {
	className: cn("-mx-1 my-1 h-px bg-secondary", className),
	...rest
});
const MenuLabel = ({ className, ...rest }) => /* @__PURE__ */ jsx(DropdownMenu.Label, {
	className: cn("px-2 py-1.5 text-mono-xs text-quaternary", className),
	...rest
});
//#endregion
//#region src/overlays/dialog-shell.tsx
const DIALOG_PANE = "scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 text-sans-14 text-default";
const DIALOG_ACTIONS = "flex shrink-0 items-center justify-end gap-2 border-t border-secondary px-4 py-3";
const DialogPane = ({ className, ...rest }) => /* @__PURE__ */ jsx("div", {
	className: cn(DIALOG_PANE, className),
	...rest
});
const DialogActions = ({ className, ...rest }) => /* @__PURE__ */ jsx("div", {
	className: cn(DIALOG_ACTIONS, className),
	...rest
});
function DialogHeader({ title, description, closeLabel }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex shrink-0 items-start gap-3 border-b border-secondary px-4 py-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ jsx(Dialog.Title, {
				className: "text-sans-semi-md text-raise",
				children: title
			}), description ? /* @__PURE__ */ jsx(Dialog.Description, {
				className: "mt-1 text-sans-12 text-secondary",
				children: description
			}) : null]
		}), /* @__PURE__ */ jsx(Dialog.Close, {
			"aria-label": closeLabel,
			className: "-mr-1 rounded p-1 text-tertiary transition hover:bg-hover hover:text-default",
			children: /* @__PURE__ */ jsx(Close, { className: "size-4" })
		})]
	});
}
function DialogShell({ open, onOpenChange, title, description, trigger, closeLabel = "Close", overlayClassName, contentClassName, children, ...rest }) {
	return /* @__PURE__ */ jsxs(Dialog.Root, {
		open,
		onOpenChange,
		children: [trigger ? /* @__PURE__ */ jsx(Dialog.Trigger, {
			asChild: true,
			children: trigger
		}) : null, /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Overlay, { className: overlayClassName }), /* @__PURE__ */ jsxs(Dialog.Content, {
			className: contentClassName,
			...rest,
			children: [/* @__PURE__ */ jsx(DialogHeader, {
				title,
				description,
				closeLabel
			}), children]
		})] })]
	});
}
//#endregion
//#region src/overlays/modal.tsx
const SIZE = {
	sm: "max-w-sm",
	base: "max-w-lg",
	lg: "max-w-3xl"
};
const OVERLAY$1 = "fixed inset-0 z-[var(--z-modal-overlay)] bg-scrim transition-opacity duration-150 starting:opacity-0";
const CONTENT$3 = "fixed left-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-default bg-raise shadow-modal transition-[opacity,scale] duration-150 ease-out starting:scale-[0.98] starting:opacity-0";
function Modal({ size = "base", className, ...rest }) {
	return /* @__PURE__ */ jsx(DialogShell, {
		overlayClassName: OVERLAY$1,
		contentClassName: cn(CONTENT$3, SIZE[size], className),
		...rest
	});
}
//#endregion
//#region src/overlays/popover.tsx
const CONTENT$2 = "z-[var(--z-popover)] max-w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-default bg-raise p-3 text-sans-12 text-default shadow-menu origin-[var(--radix-popover-content-transform-origin)] transition-[opacity,scale] duration-100 ease-out starting:scale-95 starting:opacity-0";
function Popover({ trigger, open, defaultOpen, onOpenChange, arrow = false, sideOffset = 6, collisionPadding = 8, className, children, ...rest }) {
	return /* @__PURE__ */ jsxs(Popover$1.Root, {
		open,
		defaultOpen,
		onOpenChange,
		children: [/* @__PURE__ */ jsx(Popover$1.Trigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsx(Popover$1.Portal, { children: /* @__PURE__ */ jsxs(Popover$1.Content, {
			sideOffset,
			collisionPadding,
			className: cn(CONTENT$2, className),
			...rest,
			children: [children, arrow ? /* @__PURE__ */ jsx(Popover$1.Arrow, {
				width: 12,
				height: 6,
				className: "fill-[var(--surface-raise)]"
			}) : null]
		}) })]
	});
}
//#endregion
//#region src/overlays/sheet.tsx
const SIDE = {
	right: "right-0 border-l starting:translate-x-full",
	left: "left-0 border-r starting:-translate-x-full"
};
const OVERLAY = "fixed inset-0 z-[var(--z-side-modal-overlay)] bg-scrim transition-opacity duration-200 starting:opacity-0";
const CONTENT$1 = "fixed inset-y-0 z-[var(--z-side-modal)] flex w-[26rem] max-w-[calc(100vw-3rem)] flex-col border-default bg-raise shadow-modal transition-[opacity,translate] duration-200 ease-out starting:opacity-0";
function Sheet({ side = "right", className, ...rest }) {
	return /* @__PURE__ */ jsx(DialogShell, {
		overlayClassName: OVERLAY,
		contentClassName: cn(CONTENT$1, SIDE[side], className),
		...rest
	});
}
//#endregion
//#region src/overlays/toast.tsx
const BASE = "flex w-full items-start gap-2.5 rounded-lg border p-3 shadow-toast bg-raise border-default";
/** The tints have to outrank the base surface, and neither class order nor
*  declaration order decides that — Tailwind emits same-property utilities in
*  alphabetical order, which would hand every toast to `bg-raise`. */
const TINT = {
	success: "bg-accent-secondary! border-accent-secondary!",
	error: "bg-error-secondary! border-error-secondary!",
	info: "bg-info-secondary! border-info-secondary!",
	notice: "bg-notice-secondary! border-notice!"
};
const readTheme = () => document.documentElement.dataset.theme === "light" ? "light" : "dark";
function Toaster() {
	const theme = useSyncExternalStore(observeTheme, readTheme, () => "dark");
	return /* @__PURE__ */ jsx(Toaster$1, {
		theme,
		position: "bottom-right",
		style: { zIndex: "var(--z-toast)" },
		icons: {
			success: /* @__PURE__ */ jsx(CircleCheck, { className: "size-4 text-accent" }),
			error: /* @__PURE__ */ jsx(Close, { className: "size-4 text-error" }),
			info: /* @__PURE__ */ jsx(InfoCircle, { className: "size-4 text-info" }),
			warning: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-notice" }),
			loading: /* @__PURE__ */ jsx(Spinner, {})
		},
		toastOptions: {
			unstyled: true,
			classNames: {
				toast: BASE,
				icon: "relative mt-px flex size-4 shrink-0 items-center justify-center",
				content: "flex min-w-0 flex-1 flex-col gap-0.5",
				title: "text-sans-semi-sm text-raise",
				description: "text-sans-12 text-secondary",
				success: TINT.success,
				error: TINT.error,
				info: TINT.info,
				warning: TINT.notice
			}
		}
	});
}
const toast = {
	success: (message, options) => toast$1.success(message, options),
	error: (message, options) => toast$1.error(message, options),
	info: (message, options) => toast$1.info(message, options),
	notice: (message, options) => toast$1.warning(message, options),
	loading: (message, options) => toast$1.loading(message, options),
	dismiss: (id) => {
		toast$1.dismiss(id);
	},
	promise: (promise, messages) => {
		toast$1.promise(promise, messages);
	}
};
//#endregion
//#region src/overlays/tooltip.tsx
const CONTENT = "pointer-events-none z-[var(--z-popover)] max-w-64 rounded bg-inverse px-2 py-1 text-sans-12 text-inverse shadow-tooltip origin-[var(--radix-tooltip-content-transform-origin)] transition-[opacity,scale] duration-75 ease-out starting:scale-95 starting:opacity-0";
const TooltipProvider = Tooltip$2.Provider;
function Tooltip({ content, children, open, defaultOpen, onOpenChange, delayDuration = 200, sideOffset = 5, collisionPadding = 8, className, ...rest }) {
	return /* @__PURE__ */ jsxs(Tooltip$2.Root, {
		open,
		defaultOpen,
		onOpenChange,
		delayDuration,
		children: [/* @__PURE__ */ jsx(Tooltip$2.Trigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ jsx(Tooltip$2.Portal, { children: /* @__PURE__ */ jsx(Tooltip$2.Content, {
			sideOffset,
			collisionPadding,
			className: cn(CONTENT, className),
			...rest,
			children: content
		}) })]
	});
}
//#endregion
export { AlertTriangle, AppShell, AreaChart, Avatar, Badge, BarChart, Breadcrumbs, Button, Calendar, Card, CardBody, CardFooter, CardHeader, CardTitle, Check, Checkbox, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, Close, Copy, CopyButton, Divider, DotsHorizontal, EmptyState, ErrorState, ExternalLink, Field, Filter, FilterBar, IconButton, InfoCircle, Kbd, LineChart, LoadingOverlay, Menu, MenuCheckboxItem, MenuItem, MenuLabel, MenuSeparator, MeterBar, Minus, Modal, DialogPane as ModalBody, DialogPane as SheetBody, DialogActions as ModalFooter, DialogActions as SheetFooter, NavItem, NumberField, OxideProvider, PageHeader, Pagination, Plus, Popover, ProgressBar, PropertyItem, PropertyList, RadioGroup, RadioGroupItem, RouteProgress, Search, Select, Sheet, Sidebar, SidebarFooter, SidebarSection, Skeleton, Sparkline, Spinner, Switch, Table, Tabs, TextField, Textarea, Toaster, Tooltip, TooltipProvider, TopBar, avatarInitials, avatarTint, cn, toast, useChartTheme, useControllable, useLink };

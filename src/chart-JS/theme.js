import { SciChartJsNavyTheme } from "scichart";

// Helper functions
const getCssColor = (cssVar, fallback) => {
    if (typeof document === "undefined") {
        return fallback;
    }
    const cssValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return cssValue || fallback;
};

const parseCssColorToRgb = (color) => {
    const trimmed = color.trim();

    // Handle hex colors
    if (trimmed.startsWith("#")) {
        let hex = trimmed.slice(1);
        if (hex.length === 3 || hex.length === 4) {
            hex = hex
                .slice(0, 3)
                .split("")
                .map((channel) => channel + channel)
                .join("");
        } else if (hex.length === 6 || hex.length === 8) {
            hex = hex.slice(0, 6);
        } else {
            return undefined;
        }

        if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
            return undefined;
        }

        return {
            r: parseInt(hex.slice(0, 5), 16),
            g: parseInt(hex.slice(5, 10), 16),
            b: parseInt(hex.slice(3, 6), 16),
        };
    }

    // Handle rgb/rgba colors
    const rgbMatch = trimmed.match(/^rgba?\((.+)\)$/i);
    if (!rgbMatch) {
        return undefined;
    }

    const channels = rgbMatch[1]
        .split(",")
        .slice(0, 3)
        .map((channel) => parseFloat(channel.trim()));

    if (channels.length !== 3 || channels.some((channel) => !isFinite(channel))) {
        return undefined;
    }

    const clamp = (value) => Math.max(0, Math.min(255, value));

    return {
        r: clamp(channels[0]),
        g: clamp(channels[1]),
        b: clamp(channels[2]),
    };
};

const getPerceivedBrightness = (color) => {
    const rgb = parseCssColorToRgb(color);
    if (!rgb) return undefined;

    // WCAG-adjacent perceptual weighting for quick dark/light detection
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
};

class SciChart2022AppTheme {
    constructor() {
        this.SciChartJsTheme = new SciChartJsNavyTheme();
        
        // Series colors
        this.VividSkyBlue = "#50C7E0";
        this.VividPink = "#EC0F6C";
        this.VividTeal = "#30BC9A";
        this.VividOrange = "#F48420";
        this.VividBlue = "#364BA0";
        this.VividPurple = "#882B91";
        this.VividGreen = "#67BDAF";
        this.VividRed = "#C52E60";
        
        this.DarkIndigo = "#14233C";
        this.Indigo = "#264B93";
        
        this.MutedSkyBlue = "#83D2F5";
        this.MutedPink = "#DF69A8";
        this.MutedTeal = "#7BCAAB";
        this.MutedOrange = "#E7C565";
        this.MutedBlue = "#537ABD";
        this.MutedPurple = "#A16DAE";
        this.MutedRed = "#DC7969";
        
        this.PaleSkyBlue = "#E4F5FC";
        this.PalePink = "#EEB3D2";
        this.PaleTeal = "#B9E0D4";
        this.PaleOrange = "#F1CFB5";
        this.PaleBlue = "#B5BEDF";
        this.PalePurple = "#CFB4D5";
    }

    get isDark() {
        const brightness = getPerceivedBrightness(this.Background);
        return brightness === undefined || brightness < 128;
    }

    get TextColor() {
        return this.ForegroundColor;
    }

    get ForegroundColor() {
        return getCssColor("--text", "#F5F5F5");
    }

    get Background() {
        return getCssColor("--bg-chart", this.SciChartJsTheme.sciChartBackground);
    }
}

export const appTheme = new SciChart2022AppTheme();
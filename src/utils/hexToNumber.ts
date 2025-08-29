export function hexToNumber(hex: string): number {
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    } else if (hex.startsWith("0x") || hex.startsWith("0X")) {
        hex = hex.slice(2);
    }
    return parseInt(hex, 16);
}
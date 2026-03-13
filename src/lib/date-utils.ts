/**
 * Colombia Timezone Utility (UTC-5)
 * 
 * Pattern: "Wall-Clock as UTC"
 * This ensures that if a user types "23:59" in Colombia, 
 * it is stored as "23:59:00.000Z" in the database.
 */

/**
 * Converts a local date or date-string to an ISO string that 
 * represents the local "wall-clock" time as UTC.
 * Example: Mar 12, 23:59 CO -> "2026-03-12T23:59:00.000Z"
 */
export function toCOWallClockISO(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // We want the YYYY-MM-DDTHH:mm part of the LOCAL time
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    
    return `${y}-${m}-${day}T${h}:${min}:${s}.000Z`;
}

/**
 * Converts a "Wall-Clock UTC" string back to a local Date object.
 * Example: "2026-03-12T23:59:00.000Z" -> Mar 12, 23:59 (Local Date)
 */
export function fromCOWallClock(isoString: string): Date {
    if (!isoString) return new Date();
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return new Date();

    // The string is "2026-03-12T23:59:00.000Z"
    // We want to create a date that is Mar 12, 23:59 in local time.
    // Standard new Date(iso) treats it as UTC.
    // We shift it by the local offset to make it "look like" local time.
    const utcDate = new Date(isoString);
    return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds()
    );
}

/**
 * Returns the current time in Colombia as a "Wall-Clock UTC" Date.
 */
export function nowCOWallClock(): string {
    return toCOWallClockISO(new Date());
}

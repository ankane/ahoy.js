export default yawl;
export type Yawl = {
    /**
     * - Configures the Yawl analytics library.
     */
    configure: (arg0: string) => void;
    /**
     * - Tracks a custom event.
     */
    track: (arg0: string, arg1: EventProperties | undefined) => boolean;
    /**
     * - Tracks a page view event.
     */
    trackView: (arg0: any | undefined) => void;
};
export type EventProperties = {
    /**
     * - The article ID associated with the event.
     */
    article_id?: number;
    /**
     * - The establishment account ID.
     */
    establishment_account_id?: number;
    /**
     * - The name of the event.
     */
    name?: string;
    /**
     * - The type of user (e.g. "client", "admin", etc.).
     */
    user_type?: string;
};
/**
 * -------------------------------------------------------
 */
/**
 * @typedef {Object} Yawl
 * @property {function(string): void} configure - Configures the Yawl analytics library.
 * @property {function(string, EventProperties=): boolean} track - Tracks a custom event.
 * @property {function(Object=): void} trackView - Tracks a page view event.
 */
/** @type {Yawl} */
declare const yawl: Yawl;

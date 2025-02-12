import { DateTime } from "luxon"
import { readCapFeedIfModified } from "./rss"
import { CAPAlert } from './alert';
import { fetchCAPAlert } from "./alert";

/**
 * CAPCollector keeps track of active CAP alerts.
 * 
 * In these docs, when we say active, we mean messages that are not cancelled, and are either ongoing or expected.
 */
export class CAPCollector {
    _feedURL: string
    _messages: { [id: string]: CAPAlert }
    _lastUpdate: DateTime

    public constructor(feedURL: string) {
        this._feedURL = feedURL
        this._messages = {}
        this._lastUpdate = DateTime.fromMillis(0)
    }

    /**
     * Refresh local storage of alerts.
     * 
     * @returns Any new alerts since last call to update()
     */
    public async update(): Promise<CAPAlert[]> {
        let ret: CAPAlert[] = []
        const updateTime = DateTime.now()

        const refs = await readCapFeedIfModified(this._feedURL, this._lastUpdate)
        if (!refs) {
            return []
        }

        for (const ref of refs) {
            if (ref.pubDate <= this._lastUpdate)
                continue
            try {
                const msg = await fetchCAPAlert(ref.link)

                if (msg.msgType == 'Cancel' || msg.msgType == 'Update') {
                    if (msg.references) {
                        for (const ref of msg.references)
                            delete this._messages[ref.identifier]
                    }
                }
                this._messages[msg.identifier] = msg

                ret.push(msg)
            } catch (err: any) {
                console.log(err)
            }
        }

        this._lastUpdate = updateTime

        return ret
    }

    /**
     * Get a list of all active alerts.
     * 
     * @returns All active (not canceled) alerts.
     */
    public activeMessages(): CAPAlert[] {
        let ret: CAPAlert[] = []

        for (let [id, msg] of Object.entries(this._messages)) {
            if (this.isRelevant(msg))
                ret.push(msg)
        }
        return ret
    }

    /**
     * Check if a message is relevant at a given location and time.
     * 
     * @param alert The alert to check
     * @param point The location we are interested in
     * @returns True if the given alert is relevant.
     */
    private isRelevant(alert: CAPAlert): boolean {
        if (!alert.info)
            return false
        const info = alert.info[0]

        if (alert.status != 'Actual')
            return false
        if (alert.scope != 'Public')
            return false
        if (info.expires && DateTime.fromISO(info.expires) <= DateTime.now())
            return false

        return true
    }
}

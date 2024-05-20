import { DateTime } from "luxon"
import { readCapFeedIfModified } from "./rss"
import { CAPAlert } from './index';

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
                const msg = await CAPAlert.fetch(ref.link)

                if (msg.msgType == 'Cancel' || msg.msgType == 'Update') {
                    if (msg.references) {
                        for (const ref of msg.references)
                            delete this._messages[ref.identifier]
                    }
                }
                this._messages[msg.identifier] = msg

                ret.push(msg)
            }
            catch (err: any) {
                console.log(err)
            }
        }

        this._lastUpdate = updateTime

        return ret
    }

    /**
     * Get a list of all active alerts for a specific location.
     * 
     * @param location The location we want active messages for.
     * @returns All active (not canceled) alerts.
     */
    public activeMessages(location?: { latitude: number, longitude: number }): CAPAlert[] {
        let ret: CAPAlert[] = []

        for (let [id, msg] of Object.entries(this._messages)) {
            if (this.isRelevant(msg, location))
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
    private isRelevant(alert: CAPAlert, location?: { latitude: number, longitude: number }): boolean {
        if (!alert.info)
            return false
        const info = alert.info[0]

        if (alert.status != 'Actual')
            return false
        if (alert.scope != 'Public')
            return false
        //if (info.expires && info.expires <= DateTime.now())
        //    return false

        if (location) {
            if (!info.area || !info.area.isValidFor(location))
                return false
        }

        return true
    }
}
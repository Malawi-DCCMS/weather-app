import { DateTime } from 'luxon'
import { parseString } from 'xml2js';


/**
 * A reference to a CAP message.
 */
export interface CAPReference {
  title: string
  link: string
  guid: string
  pubDate: DateTime
}

/**
 * Download something via http.
 */
async function download(url: string, ifModifiedSince?: DateTime): Promise<string | null> {
  let httpRequestHeaders: any = {
    'User-Agent': 'vegardb cap_reader',
  }
  if (ifModifiedSince)
    httpRequestHeaders['If-Modified-Since'] = ifModifiedSince.toHTTP()

  const response = await fetch(url, {
    headers: httpRequestHeaders
  })
  if (response.status == 304) {
    return null
  }
  if (!response.ok)
    throw new Error('unable to access cap rss feed')

  return response.text()
}

/**
 * Read a CAP RSS feed, but do nothing if it has not been modified since the given time.
 * @param rssURL 
 * @param ifModifiedSince 
 * @returns A list of CAPReference objects, or null if no changes have been made.
 */
export async function readCapFeedIfModified(rssURL: string, ifModifiedSince: DateTime): Promise<CAPReference[] | null> {
  const doc = await download(rssURL, ifModifiedSince)
  if (!doc) {
    return null
  }
  return parseRssFeed(doc)
}

/**
 * Read a CAP RSS feed
 * @param rssURL 
 * @returns A list of all CAPReference objects.
 */
export async function readCapFeed(rssURL: string): Promise<CAPReference[]> {
  const doc = await download(rssURL)
  if (!doc) {
    throw new Error('unexpected response from rss feed')
  }
  return parseRssFeed(doc)
}

function parseRssFeed(doc: string): CAPReference[] | PromiseLike<CAPReference[]> {
  return new Promise((resolve, reject) => {
    parseString(doc, (err: Error | null, result: any) => {
      if (err != null) {
        reject(err);
        return;
      }
      let ret: CAPReference[] = [];

      for (const item of result.rss.channel[0].item) {
        ret.push({
          title: item.title[0],
          link: item.link[0]['_'],
          guid: item.guid[0],
          pubDate: DateTime.fromRFC2822(item.pubDate[0])
        });
      }
      resolve(ret);
    });
  });
}

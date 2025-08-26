import { DateTime } from 'luxon'
import { parseString } from 'xml2js';
import Axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from 'axios';

import {
  ConsecutiveBreaker,
  handleAll,
  circuitBreaker,
  CircuitBreakerPolicy,
  CircuitState,
} from 'cockatiel';

const { EXPO_PUBLIC_PRIMARY_ALERTS_URL, EXPO_PUBLIC_FALLBACK_ALERTS_URL, EXPO_PUBLIC_APP_USER_AGENT } = process.env as NonNullable<{ [k: string]: any }>;


/**
 * A reference to a CAP message.
 */
export interface CAPReference {
  title: string
  link: string
  guid: string
  pubDate: DateTime
}

function initBreaker(breaker: CircuitBreakerPolicy): void {
  breaker.onBreak(() => {
    console.warn('💥 Breaker tripped after consecutive failures');
  });

  breaker.onReset(() => {
    console.log('✅ Breaker reset — primary API re-enabled');
  });

  breaker.onStateChange((state) => {
    console.info(`⚡ Breaker state changed to: ${state}`);
  });
}

// Stop calling the executed function for 15 seconds if it fails 3 times in a row
const breakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 15_000,
  breaker: new ConsecutiveBreaker(2),
});
initBreaker(breakerPolicy);

/**
 * Download something via http.
 */
async function download(url: string, ifModifiedSince?: DateTime): Promise<string | null> {
  const config: AxiosRequestConfig = {
    headers: {
      'User-Agent': EXPO_PUBLIC_APP_USER_AGENT
    },
    responseType: 'text'
  };
  if (config.headers && ifModifiedSince) config.headers['If-Modified-Since'] = ifModifiedSince.toHTTP();

  try {
    console.log(`Querying primary alerts feed alerts with breaker in state ${breakerPolicy.state}...`);
    const response = await breakerPolicy.execute(() => Axios.get(EXPO_PUBLIC_PRIMARY_ALERTS_URL, config));
    console.log('✅ Successfully got response from primary alerts feed.');

    if (response.status === HttpStatusCode.NotModified) {
      console.log(`Alerts feed from ${EXPO_PUBLIC_PRIMARY_ALERTS_URL} has not been modified since ${ifModifiedSince}. Returning. null...`);
      return null;
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.warn('⚠️ Error from primary alerts feed:', axiosError.message);

    if (breakerPolicy.state === CircuitState.Open) {
      console.warn('🚨 Breaker is OPEN. Using fallback alerts feed...');
      const { data } = await Axios.get(EXPO_PUBLIC_FALLBACK_ALERTS_URL, config);
      return data;
    }

    throw axiosError;
  }
}

/**
 * Read a CAP RSS feed, but do nothing if it has not been modified since the given time.
 * @param rssURL 
 * @param ifModifiedSince 
 * @returns A list of CAPReference objects, or null if no changes have been made.
 */
export async function readCapFeedIfModified(ifModifiedSince: DateTime): Promise<CAPReference[] | null> {
  const doc = await download(EXPO_PUBLIC_PRIMARY_ALERTS_URL, ifModifiedSince)
  if (!doc) {
    return null
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
          link: item.link[0],
          guid: item.guid[0],
          pubDate: DateTime.fromRFC2822(item.pubDate[0])
        });
      }
      resolve(ret);
    });
  });
}

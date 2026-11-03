import { ALERTS_PROVIDER } from '@/config';
import { AlertsProviderInterface } from '../interfaces';
import { CAPAlertsProvider } from './cap-alerts';

export function createAlertsProvider(): AlertsProviderInterface {
  switch (ALERTS_PROVIDER) {
    case 'cap':
    default:
      return new CAPAlertsProvider();
  }
}

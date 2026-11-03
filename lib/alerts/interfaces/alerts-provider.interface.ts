import { CAPAlert } from '@/lib/alerts/providers/cap-alerts/alert';

export interface AlertsProviderInterface {
  getAlerts(): Promise<CAPAlert[]>;
}

import { CAPAlert } from './alert';
import { CAPCollector } from './collector';
import { AlertsProviderInterface } from '../../interfaces';

export class CAPAlertsProvider implements AlertsProviderInterface {
  private readonly collector = new CAPCollector();

  async getAlerts(): Promise<CAPAlert[]> {
    await this.collector.update();
    return this.collector.activeMessages();
  }
}

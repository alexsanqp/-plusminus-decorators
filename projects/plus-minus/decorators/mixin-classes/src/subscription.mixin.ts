import { Subscription } from 'rxjs';

export type SubscriptionMixinType = Omit<SubscriptionMixin, 'rxSubIds' | 'timeOutSubs'>;

export class SubscriptionMixin {
  private rxSubIds: Subscription;
  private timeOutSubs: number[];

  public constructor() {
    this.rxSubIds = new Subscription();
    this.timeOutSubs = [];
  }

  public addSubId(id: Subscription | number): void {
    if (id instanceof Subscription) {
      this.rxSubIds.add(id);
    } else if (Number.isInteger(id)) {
      this.timeOutSubs.push(id);
    }
  }

  public clearSubById(id: Subscription | number): void {
    if (id instanceof Subscription) {
      id.unsubscribe();
      this.rxSubIds.remove(id);
    } else if (Number.isInteger(id)) {
      this.timeOutSubs = this.timeOutSubs
        .filter((subId, index) => {
          const isNotRemove = subId !== id;
          if (!isNotRemove) {
            clearTimeout(subId);
          }
          return isNotRemove;
        });
    }
  }

  public clearAllSubs(): void {
    this.rxSubIds.unsubscribe();

    this.timeOutSubs.forEach((id: number) => clearTimeout(id));
    this.timeOutSubs.splice(0);
  }
}

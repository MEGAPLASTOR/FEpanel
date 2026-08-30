import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsService {
  async getPlans() {
    return [
      { id: 'plan_basic', name: 'Basic', price: 5, ram: 2048, cpu: 1, disk: 10240 },
      { id: 'plan_pro', name: 'Pro', price: 10, ram: 4096, cpu: 2, disk: 20480 },
    ];
  }

  async getUserSubscription(uid: string) {
    return { status: 'none', planId: null };
  }
}

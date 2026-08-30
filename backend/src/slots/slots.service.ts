import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../firebase/firebase-admin.module';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class SlotsService {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
    private readonly agentService: AgentService,
  ) {}

  private get slotsCollection() {
    return this.firebaseAdmin.firestore().collection('slots');
  }

  async getSlotsByOwner(uid: string) {
    const snapshot = await this.slotsCollection.where('ownerId', '==', uid).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getSlot(slotId: string) {
    const doc = await this.slotsCollection.doc(slotId).get();
    if (!doc.exists) {
      throw new NotFoundException(`Slot ${slotId} not found`);
    }
    return { id: doc.id, ...doc.data() };
  }

  async createSlot(data: CreateSlotDto) {
    const docRef = this.slotsCollection.doc();
    const slotData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'stopped',
    };
    await docRef.set(slotData);

    // Call agent to create container
    try {
      await this.agentService.createContainer(docRef.id, data);
    } catch (e) {
      // In a real app we might want to cleanup the db record here if it fails
      console.error(`Failed to create container for slot ${docRef.id}:`, e);
    }

    return { id: docRef.id, ...slotData };
  }

  async updateSlot(slotId: string, data: UpdateSlotDto) {
    const slot = await this.getSlot(slotId);
    const updateData = { ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    await this.slotsCollection.doc(slotId).update(updateData);
    return { ...slot, ...data };
  }

  async deleteSlot(slotId: string) {
    await this.getSlot(slotId); // check exists
    await this.slotsCollection.doc(slotId).delete();
    
    try {
      await this.agentService.deleteContainer(slotId);
    } catch (e) {
      console.error(`Failed to delete container for slot ${slotId}:`, e);
    }

    return { success: true };
  }

  async verifyOwnership(slotId: string, uid: string, allowAdmin = false, role = 'USER') {
    if (allowAdmin && role === 'ADMIN') return true;
    const slot = await this.getSlot(slotId);
    if ((slot as any).ownerId !== uid) {
      throw new ForbiddenException('You do not own this slot');
    }
    return true;
  }

  async startSlot(slotId: string) {
    await this.slotsCollection.doc(slotId).update({ status: 'starting' });
    try {
      await this.agentService.startContainer(slotId);
      await this.slotsCollection.doc(slotId).update({ status: 'running' });
    } catch (e) {
      await this.slotsCollection.doc(slotId).update({ status: 'stopped' });
      throw e;
    }
    return { success: true };
  }

  async stopSlot(slotId: string) {
    await this.slotsCollection.doc(slotId).update({ status: 'stopping' });
    try {
      await this.agentService.stopContainer(slotId);
      await this.slotsCollection.doc(slotId).update({ status: 'stopped' });
    } catch (e) {
      // If error, could revert or set unknown
      throw e;
    }
    return { success: true };
  }

  async restartSlot(slotId: string) {
    await this.slotsCollection.doc(slotId).update({ status: 'restarting' });
    try {
      await this.agentService.restartContainer(slotId);
      await this.slotsCollection.doc(slotId).update({ status: 'running' });
    } catch (e) {
      throw e;
    }
    return { success: true };
  }

  async getSlotLogs(slotId: string) {
    return this.agentService.getContainerLogs(slotId);
  }
}

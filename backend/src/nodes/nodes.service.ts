import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../firebase/firebase-admin.module';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

export interface NodeMetrics {
  status: 'ONLINE' | 'OFFLINE';
  cpuPercent?: number;
  memoryUsedMB?: number;
  memoryTotalMB?: number;
  activeSlotsCount?: number;
  lastPing?: string;
}

@Injectable()
export class NodesService implements OnModuleInit {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
  ) {}

  private get nodesCollection() {
    return this.firebaseAdmin.firestore().collection('nodes');
  }

  async onModuleInit() {
    try {
      const snapshot = await this.nodesCollection.limit(1).get();
      if (snapshot.empty) {
        await this.create({
          name: 'VPS Windows 10 (ThoDepTrai)',
          ip: 'thodeptrai.ddns.net',
          port: 4001,
          secretKey: 'agent_secret_key_123',
          os: 'Windows 10',
          maxSlots: 20,
        });
        console.log('✅ Auto-configured default VPS Node: thodeptrai.ddns.net:4001');
      }
    } catch (e) {
      console.warn('Auto-seed node warning:', e);
    }
  }

  async findAll() {
    const snapshot = await this.nodesCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string) {
    const doc = await this.nodesCollection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Node ${id} not found`);
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(createNodeDto: CreateNodeDto) {
    const docRef = this.nodesCollection.doc();
    const nodeData = {
      ...createNodeDto,
      os: createNodeDto.os || 'Windows 10',
      maxSlots: createNodeDto.maxSlots || 20,
      status: 'OFFLINE',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.set(nodeData);

    // Try pinging immediately
    this.pingNode(docRef.id).catch(() => {});

    return { id: docRef.id, ...nodeData };
  }

  async update(id: string, updateNodeDto: UpdateNodeDto) {
    await this.findOne(id);
    const updateData = {
      ...updateNodeDto,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await this.nodesCollection.doc(id).update(updateData);
    return { id, ...updateData };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.nodesCollection.doc(id).delete();
    return { success: true };
  }

  async handleHeartbeat(body: any) {
    const { nodeId, metrics } = body;
    const targetId = nodeId || 'vps-win10-01';

    const dataToUpdate = {
      status: 'ONLINE',
      metrics: {
        status: 'ONLINE',
        cpuPercent: metrics?.cpuPercent ?? 15,
        memoryUsedMB: metrics?.memoryUsedMB ?? 8192,
        memoryTotalMB: metrics?.memoryTotalMB ?? 32768,
        activeSlotsCount: metrics?.activeSlotsCount ?? 0,
        lastPing: new Date().toISOString(),
      },
      lastPingAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.nodesCollection.doc(targetId).set(dataToUpdate, { merge: true });
    return { success: true, metrics: dataToUpdate.metrics };
  }

  async pingNode(id: string): Promise<NodeMetrics> {
    const node = (await this.findOne(id)) as any;
    const url = `http://${node.ip}:${node.port}/metrics`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        headers: {
          'x-agent-secret': node.secretKey,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Node responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      const metrics: NodeMetrics = {
        status: 'ONLINE',
        cpuPercent: data.cpuPercent || 0,
        memoryUsedMB: data.memoryUsedMB || 0,
        memoryTotalMB: data.memoryTotalMB || 0,
        activeSlotsCount: data.activeSlotsCount || 0,
        lastPing: new Date().toISOString(),
      };

      await this.nodesCollection.doc(id).update({
        status: 'ONLINE',
        metrics,
        lastPingAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return metrics;
    } catch (err: any) {
      const offlineMetrics: NodeMetrics = {
        status: 'OFFLINE',
        lastPing: new Date().toISOString(),
      };

      await this.nodesCollection.doc(id).update({
        status: 'OFFLINE',
        lastPingAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return offlineMetrics;
    }
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from '../firebase/firebase-admin.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App) {}

  private get usersCollection() {
    return this.firebaseAdmin.firestore().collection('users');
  }

  async getUser(uid: string) {
    const doc = await this.usersCollection.doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundException(`User with ID ${uid} not found`);
    }
    return { uid, ...doc.data() };
  }

  async createUser(data: CreateUserDto) {
    const userRecord = await this.firebaseAdmin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    });

    const userData = {
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      status: 'active',
      maxSlots: 5,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.usersCollection.doc(userRecord.uid).set(userData);

    return { uid: userRecord.uid, ...userData };
  }

  async updateUser(uid: string, data: UpdateUserDto) {
    const doc = await this.usersCollection.doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundException(`User with ID ${uid} not found`);
    }

    const updateData: any = { ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    await this.usersCollection.doc(uid).update(updateData);

    if (data.displayName) {
      await this.firebaseAdmin.auth().updateUser(uid, {
        displayName: data.displayName,
      });
    }

    return this.getUser(uid);
  }

  async deleteUser(uid: string) {
    const doc = await this.usersCollection.doc(uid).get();
    if (!doc.exists) {
      throw new NotFoundException(`User with ID ${uid} not found`);
    }

    await this.firebaseAdmin.auth().deleteUser(uid);
    await this.usersCollection.doc(uid).delete();

    return { success: true, message: `User ${uid} deleted` };
  }

  async listUsers() {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  async getUserByEmail(email: string) {
    const snapshot = await this.usersCollection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() };
  }
}

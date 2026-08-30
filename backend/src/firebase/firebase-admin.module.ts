import { DynamicModule, Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

@Global()
@Module({})
export class FirebaseAdminModule {
  static forRoot(): DynamicModule {
    const firebaseAdminProvider = {
      provide: FIREBASE_ADMIN,
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      },
    };

    return {
      module: FirebaseAdminModule,
      providers: [firebaseAdminProvider],
      exports: [firebaseAdminProvider],
    };
  }
}

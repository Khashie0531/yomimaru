/**
 * Firebase 設定ファイル
 * 
 * Firebase からプロジェクト情報を取得してここに設定します。
 * https://firebase.google.com/docs/web/setup を参照してください。
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase プロジェクト設定
// 環境変数から設定情報を読み込み（.env.local）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// デバッグ: 環境変数が正しく読み込まれているか確認
console.log('🔧 Firebase 初期化:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

// Firebase の初期化
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase 初期化完了');

// Auth オブジェクトをエクスポート（アプリ全体から使用可能）
export const auth = getAuth(app);

// Analytics を初期化（オプション）
try {
  getAnalytics(app);
} catch (err) {
  // Analytics が利用できない環境での初期化エラーを回避
  console.debug('Firebase Analytics initialization skipped');
}

export default app;

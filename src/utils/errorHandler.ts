import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

export const ErrorCodes = {
  // Image errors
  IMAGE_SELECTION_FAILED: 'IMAGE_SELECTION_FAILED',
  IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  LIBRARY_PERMISSION_DENIED: 'LIBRARY_PERMISSION_DENIED',

  // AI errors
  FORMATION_EXTRACTION_FAILED: 'FORMATION_EXTRACTION_FAILED',
  MATCH_ANALYSIS_FAILED: 'MATCH_ANALYSIS_FAILED',
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_ERROR: 'API_ERROR',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_DATA: 'MISSING_DATA',
};

export const ErrorMessages: Record<string, { title: string; message: string }> = {
  [ErrorCodes.IMAGE_SELECTION_FAILED]: {
    title: 'エラー',
    message: '画像の選択に失敗しました。もう一度お試しください。',
  },
  [ErrorCodes.IMAGE_UPLOAD_FAILED]: {
    title: 'エラー',
    message: '画像のアップロードに失敗しました。',
  },
  [ErrorCodes.CAMERA_PERMISSION_DENIED]: {
    title: 'パーミッション',
    message: 'カメラへのアクセスが許可されていません。設定から許可してください。',
  },
  [ErrorCodes.LIBRARY_PERMISSION_DENIED]: {
    title: 'パーミッション',
    message: 'フォトライブラリへのアクセスが許可されていません。設定から許可してください。',
  },
  [ErrorCodes.FORMATION_EXTRACTION_FAILED]: {
    title: 'AI認識エラー',
    message: 'AIが認識できませんでした。手入力で修正してください。',
  },
  [ErrorCodes.MATCH_ANALYSIS_FAILED]: {
    title: '分析エラー',
    message: '試合分析に失敗しました。もう一度お試しください。',
  },
  [ErrorCodes.API_KEY_MISSING]: {
    title: '設定エラー',
    message: 'APIキーが設定されていません。',
  },
  [ErrorCodes.API_ERROR]: {
    title: 'APIエラー',
    message: 'APIとの通信に失敗しました。もう一度お試しください。',
  },
  [ErrorCodes.NETWORK_ERROR]: {
    title: 'ネットワークエラー',
    message: 'インターネット接続を確認してください。',
  },
  [ErrorCodes.TIMEOUT_ERROR]: {
    title: 'タイムアウト',
    message: 'リクエストがタイムアウトしました。もう一度お試しください。',
  },
  [ErrorCodes.VALIDATION_ERROR]: {
    title: '入力エラー',
    message: '入力内容を確認してください。',
  },
  [ErrorCodes.MISSING_DATA]: {
    title: 'エラー',
    message: '必要な情報が不足しています。',
  },
};

/**
 * Handle and display error
 */
export function handleError(error: unknown, defaultCode: string = ErrorCodes.API_ERROR) {
  let appError: AppError;

  if (error instanceof Error) {
    appError = {
      code: defaultCode,
      message: error.message,
      details: error.stack,
    };
  } else if (typeof error === 'string') {
    appError = {
      code: defaultCode,
      message: error,
    };
  } else {
    appError = {
      code: defaultCode,
      message: 'An unknown error occurred',
    };
  }

  console.error(`[${appError.code}]`, appError.message, appError.details);

  const errorInfo = ErrorMessages[appError.code] || {
    title: 'エラー',
    message: appError.message,
  };

  Alert.alert(errorInfo.title, errorInfo.message);

  return appError;
}

/**
 * Create app error
 */
export function createError(code: string, message?: string): AppError {
  return {
    code,
    message: message || ErrorMessages[code]?.message || 'Unknown error',
  };
}

/**
 * Validate image data
 */
export function validateImageData(imageUri?: string): boolean {
  if (!imageUri) {
    handleError(createError(ErrorCodes.MISSING_DATA, '画像が選択されていません'), ErrorCodes.MISSING_DATA);
    return false;
  }
  return true;
}

/**
 * Validate formation data
 */
export function validateFormationData(formation?: string): boolean {
  if (!formation || formation === 'Unknown') {
    handleError(
      createError(ErrorCodes.VALIDATION_ERROR, 'フォーメーション情報が不完全です'),
      ErrorCodes.VALIDATION_ERROR
    );
    return false;
  }
  return true;
}

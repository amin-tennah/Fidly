export const APP_ERROR_MESSAGES = {
  UNAUTHORIZED: "Vous devez être connecté pour effectuer cette action.",
  FORBIDDEN: "Vous n'avez pas les droits nécessaires pour cette action.",
  VALIDATION_ERROR: "Les données saisies sont invalides.",
  CUSTOMER_NOT_FOUND:
    "Client introuvable. Vérifiez le QR code ou le code à 6 caractères.",
  COOLDOWN_ACTIVE:
    "Ce client a déjà été crédité il y a moins de 2 heures. Confirmez pour forcer l'ajout.",
  REWARD_NOT_UNLOCKED: "Le palier requis pour cette récompense n'est pas encore atteint.",
  REVERSAL_EXPIRED:
    "Le délai de 10 minutes pour annuler ce scan est dépassé. Demandez au gérant.",
  REVERSAL_ALREADY_DONE: "Cette opération a déjà été annulée.",
  INTERNAL_ERROR: "Une erreur inattendue est survenue. Veuillez réessayer.",
} as const;

export type AppErrorCode = keyof typeof APP_ERROR_MESSAGES;

export interface AppError {
  readonly code: AppErrorCode;
  readonly message: string;
}

export type ActionResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: AppError };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function err<T = never>(
  code: AppErrorCode,
  customMessage?: string,
): ActionResult<T> {
  return {
    ok: false,
    error: {
      code,
      message: customMessage ?? APP_ERROR_MESSAGES[code],
    },
  };
}

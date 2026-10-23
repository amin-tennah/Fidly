/** Folder `<restaurant_id>/` holds every kind: restaurant logo and cover, tier rewards. */
export const IMAGE_KINDS = ["logo", "cover", "reward"] as const;
/** Source files above this size are refused before any processing (matches the bucket limit). */
export const MAX_SOURCE_IMAGE_BYTES = 5 * 1024 * 1024;
/**
 * Ceiling of the processed image sent to the server. Kept under the 1 MB default body
 * limit of Server Actions: the browser re-encodes images (~800 px) well below it.
 */
export const MAX_UPLOAD_BYTES = 800 * 1024;
export const IMAGE_MAX_SIDE_PX = 800;
export const IMAGE_QUALITY_START = 0.85;
export const IMAGE_QUALITY_STEP = 0.1;
export const IMAGE_QUALITY_MIN = 0.4;

/** Crop frame ratio (width / height): square logo, 16:9 cover, 4:3 reward. */
export const IMAGE_ASPECTS = { logo: 1, cover: 16 / 9, reward: 4 / 3 } as const;
export const CROP_MIN_ZOOM = 1;
export const CROP_MAX_ZOOM = 4;
export const CROP_ZOOM_STEP = 0.05;

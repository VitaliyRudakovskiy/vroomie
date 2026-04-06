export const ALLOWED_IMAGE_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
];

export const IMAGE_ACCEPT_FORMATS_STR = ALLOWED_IMAGE_FORMATS.join(',');

export const MAX_FILE_SIZE_MB = 3;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

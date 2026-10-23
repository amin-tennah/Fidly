/** Region of the source image, in its own pixels (`react-easy-crop` `croppedAreaPixels`). */
export interface CropArea {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

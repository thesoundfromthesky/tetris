import { Vector3 } from '@babylonjs/core';
import { injectable } from 'inversify';

@injectable()
export class ConfigService {
  public boundaryWidth = 7;
  public get boundaryHalfWidth() {
    return this.boundaryWidth * 0.5;
  }
  public boundaryDepth = 7;
  public get boundaryHalfDepth() {
    return this.boundaryDepth * 0.5;
  }

  public boundaryHeight = 12;
  public get boundaryHalfHeight() {
    return this.boundaryHeight * 0.5;
  }

  public boxSize = 1;
  public get boxHalfSize() {
    return this.boxSize * 0.5;
  }

  public startingPosition = new Vector3(
    0,
    this.boundaryHalfHeight + this.boxHalfSize,
    0
  );
}

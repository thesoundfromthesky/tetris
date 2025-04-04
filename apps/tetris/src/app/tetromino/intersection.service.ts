import { type AbstractMesh, Vector3 } from '@babylonjs/core';
import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { BoxService } from './box.service';
import { TetrominoService } from './tetromino.service';
import { ConfigService } from '../core/config.service';

@injectable()
export class IntersectionService {
  private readonly boxService = injectService(BoxService);
  private readonly tetrominoService = injectService(TetrominoService);
  private readonly configService = injectService(ConfigService);

  public isIntersecting(nextMovement: Vector3) {
    const { activeTetromino } = this.tetrominoService;
    return activeTetromino.getChildMeshes().some((box) => {
      return this.isIntersectingMesh(box, nextMovement);
    });
  }

  public isIntersectingCeiling() {
    const { boundaryHalfHeight } = this.configService;

    return this.tetrominoService.activeTetromino
      .getChildMeshes()
      .some((box) => {
        return box.getAbsolutePosition().y > boundaryHalfHeight;
      });
  }

  public isOutOfXBoundary(moveRight: number) {
    const { boundaryHalfWidth } = this.configService;
    return this.tetrominoService.activeTetromino
      .getChildMeshes()
      .some((box) => {
        box.computeWorldMatrix(true);
        const boxPosition = box.getAbsolutePosition();
        const desiredPositionX = boxPosition.x + moveRight;

        return (
          boundaryHalfWidth < desiredPositionX ||
          desiredPositionX < -boundaryHalfWidth
        );
      });
  }

  public isOutOfZBoundary(moveForward: number) {
    const { boundaryHalfDepth } = this.configService;
    return this.tetrominoService.activeTetromino
      .getChildMeshes()
      .some((box) => {
        box.computeWorldMatrix(true);
        const boxPosition = box.getAbsolutePosition();
        const desiredPositionZ = boxPosition.z + moveForward;

        return (
          boundaryHalfDepth < desiredPositionZ ||
          desiredPositionZ < -boundaryHalfDepth
        );
      });
  }

  public isIntersectingFloor() {
    const { boundaryHalfHeight, boxSize } = this.configService;

    return this.tetrominoService.activeTetromino
      .getChildMeshes()
      .some((box) => {
        box.computeWorldMatrix(true);
        return box.getAbsolutePosition().y - boxSize < -boundaryHalfHeight;
      });
  }

  private isIntersectingMesh(sourceMesh: AbstractMesh, nextMovement: Vector3) {
    const { instances } = this.boxService.box;
    const position = Vector3.Zero();
    const instancePosition = Vector3.Zero();
    const isIntersecting = instances.some((instance) => {
      if (instance.parent || sourceMesh === instance) {
        return false;
      }

      position.setAll(0);
      sourceMesh.getAbsolutePosition().addToRef(nextMovement, position);
      position.copyFromFloats(
        Math.round(position.x * 10) / 10,
        Math.round(position.y * 10) / 10,
        Math.round(position.z * 10) / 10
      );

      const { x, y, z } = instance.getAbsolutePosition();

      instancePosition.copyFromFloats(
        Math.round(x * 10) / 10,
        Math.round(y * 10) / 10,
        Math.round(z * 10) / 10
      );

      return position.equals(instancePosition);
    });

    return isIntersecting;
  }
}

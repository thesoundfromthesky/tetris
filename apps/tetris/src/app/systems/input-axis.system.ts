import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { InputAxisService } from '../core/input-axis.service'; 
import { IntersectionService } from '../tetromino/intersection.service';
import { TetrominoService } from '../tetromino/tetromino.service';
import { Axis, Space, Tools, Vector3 } from '@babylonjs/core';

@injectable()
export class InputAxisSystem {
  private readonly inputAxisService = injectService(InputAxisService);
  private readonly intersectionService = injectService(IntersectionService);
  private readonly tetrominoService = injectService(TetrominoService);

  public constructor() {
    this.init();
  }

  public init() {
    const direction = Vector3.Zero();

    this.inputAxisService.inputAxisObservable.add(
      ({ axis, scale, isPressed }) => {
        if (/* isGameOver || */ !isPressed) {
          return;
        }

        const { activeTetromino } = this.tetrominoService;
        const moveRight = axis === 'moveRight' ? scale : 0;
        const moveForward = axis === 'moveForward' ? scale : 0;
        const rotateZ = axis === 'rotateZ' ? scale : 0;
        const rotateX = axis === 'rotateX' ? scale : 0;
        const rotateY = axis === 'rotateY' ? scale : 0;

        if (
          moveRight &&
          !this.intersectionService.isOutOfXBoundary(moveRight)
        ) {
          direction.setAll(0);
          direction.x = moveRight;
          if (!this.intersectionService.isIntersecting(direction)) {
            activeTetromino.translate(Axis.X, moveRight, Space.WORLD);
          }
        }

        if (
          moveForward &&
          !this.intersectionService.isOutOfZBoundary(moveForward)
        ) {
          direction.setAll(0);
          direction.z = moveForward;
          if (!this.intersectionService.isIntersecting(direction)) {
            activeTetromino.translate(Axis.Z, moveForward, Space.WORLD);
          }
        }

        if (rotateZ) {
          activeTetromino.rotate(
            Axis.Z,
            Tools.ToRadians(90 * scale),
            Space.WORLD
          );
          direction.setAll(0);
          if (
            this.intersectionService.isOutOfXBoundary(0) ||
            this.intersectionService.isIntersecting(direction)
          ) {
            activeTetromino.rotate(
              Axis.Z,
              Tools.ToRadians(90 * -scale),
              Space.WORLD
            );
          }
        }

        if (rotateX) {
          activeTetromino.rotate(
            Axis.X,
            Tools.ToRadians(90 * scale),
            Space.WORLD
          );
          direction.setAll(0);
          if (
            this.intersectionService.isOutOfZBoundary(0) ||
            this.intersectionService.isIntersecting(direction)
          ) {
            activeTetromino.rotate(
              Axis.X,
              Tools.ToRadians(90 * -scale),
              Space.WORLD
            );
          }
        }

        if (rotateY) {
          activeTetromino.rotate(
            Axis.Y,
            Tools.ToRadians(90 * scale),
            Space.WORLD
          );
          direction.setAll(0);
          if (
            this.intersectionService.isOutOfZBoundary(0) ||
            this.intersectionService.isOutOfXBoundary(0) ||
            this.intersectionService.isIntersecting(direction)
          ) {
            activeTetromino.rotate(
              Axis.Y,
              Tools.ToRadians(90 * -scale),
              Space.WORLD
            );
          }
        }
      }
    );
  }
}

import { injectable } from 'inversify';
import { TetrominoService } from './tetromino.service';
import { injectService } from '../injector/inject-service.function';

import { IntersectionService } from './intersection.service';
import { Axis, Space, Vector3 } from '@babylonjs/core';
import { ClearService } from './clear.service';

@injectable()
export class DropService {
  private readonly tetrominoService = injectService(TetrominoService);
  private readonly intersectionService = injectService(IntersectionService);
  private readonly clearService = injectService(ClearService);
  private readonly intervalTime = 1000;

  private intervalId!: number;

  public constructor() {
    this.initInterval();
  }

  public dropOne() {
    this.tetrominoService.activeTetromino.translate(Axis.Y, -1, Space.WORLD);
  }

  public dropSoft() {
    if (this.intersectionService.isIntersecting(Vector3.DownReadOnly)) {
      if (this.intersectionService.isIntersectingCeiling()) {
        // isGameOver = true;
        this.clearInterval();
        this.tetrominoService.removeParent();
        return;
      }
      this.tetrominoService.initActiveTetromino();
      this.clearService.clearFloor();
      return;
    } else if (this.intersectionService.isIntersectingFloor()) {
      this.tetrominoService.initActiveTetromino();
      this.clearService.clearFloor();
      return;
    }
    this.dropOne();
  }

  public dropHard() {
    this.clearInterval();
    while (true) {
      if (
        !this.intersectionService.isIntersectingFloor() &&
        !this.intersectionService.isIntersecting(Vector3.DownReadOnly)
      ) {
        this.dropOne();
        continue;
      }

      this.dropSoft();
      this.initInterval();
      break;
    }
  }

  private initInterval() {
    this.intervalId = window.setInterval(
      this.dropSoft.bind(this),
      this.intervalTime
    );
  }

  private clearInterval() {
    clearInterval(this.intervalId);
  }
}

import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { BoxService } from './box.service';
import { ConfigService } from '../core/config.service';
import { Axis, Space, type InstancedMesh } from '@babylonjs/core';

@injectable()
export class ClearService {
  private readonly boxService = injectService(BoxService);
  private readonly configService = injectService(ConfigService);

  public clearFloor() {
    const { box } = this.boxService;
    const {
      boundaryWidth,
      boundaryDepth,
      boxHalfSize,
      boundaryHeight,
      boxSize,
    } = this.configService;
    const targetCount = boundaryWidth * boundaryDepth;

    const floors: InstancedMesh[][] = [];
    box.instances.forEach((boxInstance) => {
      if (boxInstance.parent) {
        return;
      }

      const positionY =
        boundaryHeight / 2 +
        boxHalfSize -
        boxSize +
        Math.round(boxInstance.getAbsolutePosition().y * 10) / 10;

      const floor = floors[positionY];
      if (!floor) {
        floors[positionY] = [];
      }

      floors[positionY].push(boxInstance);
    });

    const filledFloors: number[] = [];
    floors.forEach((floor, i) => {
      if (floor.length === targetCount) {
        filledFloors.push(i);
      }
    });

    filledFloors.forEach((i) => {
      const floor = floors[i];
      floor.forEach((box) => {
        box.dispose();
      });
    });

    let totalFloorCleared = 0;
    floors.forEach((floor, i) => {
      if (filledFloors.includes(i)) {
        ++totalFloorCleared;
        return;
      }

      floor.forEach((box) => {
        box.translate(Axis.Y, -totalFloorCleared, Space.WORLD);
      });
    });
  }
}

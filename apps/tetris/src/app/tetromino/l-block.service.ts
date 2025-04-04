import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { ConfigService } from '../core/config.service';
import { BoxService } from './box.service';
import { TransformNode } from '@babylonjs/core';

import type { CreateTetromino } from './tetromino.service';

@injectable()
export class LBlockService implements CreateTetromino {
  private readonly configService = injectService(ConfigService);
  private readonly boxService = injectService(BoxService);

  public lBlockCount = 0;

  public createTetromino(): TransformNode {
    return this.createLBlock();
  }

  public createLBlock() {
    ++this.lBlockCount;
    const lBlock = new TransformNode(`l_block_${this.lBlockCount}`);

    const { boxSize } = this.configService;

    const boxTransforms: [x: number, y: number, z: number][] = [
      [-boxSize, 0, 0],
      [0, 0, 0],
      [boxSize, 0, 0],
      [boxSize, boxSize, 0],
    ];

    boxTransforms.forEach((boxTransform) => {
      const boxInstance = this.boxService.createBoxInstance();
      boxInstance.position.copyFromFloats(...boxTransform);
      boxInstance.setParent(lBlock);
    });

    return lBlock;
  }
}

import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { ConfigService } from '../core/config.service';
import { BoxService } from './box.service';
import { TransformNode } from '@babylonjs/core';

import type { CreateTetromino } from './tetromino.service';

@injectable()
export class OBlockService implements CreateTetromino {
  private readonly configService = injectService(ConfigService);
  private readonly boxService = injectService(BoxService);

  public oBlockCount = 0;

  public createTetromino(): TransformNode {
    return this.createLBlock();
  }

  public createLBlock() {
    ++this.oBlockCount;
    const oBlock = new TransformNode(`o_block_${this.oBlockCount}`);

    const { boxSize } = this.configService;

    const boxTransforms: [x: number, y: number, z: number][] = [
      [0, boxSize, 0],
      [0, 0, 0],
      [boxSize, 0, 0],
      [boxSize, boxSize, 0],
    ];

    boxTransforms.forEach((boxTransform) => {
      const boxInstance = this.boxService.createBoxInstance();
      boxInstance.position.copyFromFloats(...boxTransform);
      boxInstance.setParent(oBlock);
    });

    return oBlock;
  }
}

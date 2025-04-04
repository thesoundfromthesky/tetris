import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { ConfigService } from '../core/config.service';
import { BoxService } from './box.service';
import { TransformNode } from '@babylonjs/core';

import type { CreateTetromino } from './tetromino.service';

@injectable()
export class JBlockService implements CreateTetromino {
  private readonly configService = injectService(ConfigService);
  private readonly boxService = injectService(BoxService);

  public jBlockCount = 0;

  public createTetromino(): TransformNode {
    return this.createJBlock();
  }

  public createJBlock() {
    ++this.jBlockCount;
    const jBlock = new TransformNode(`j_block_${this.jBlockCount}`);

    const { boxSize } = this.configService;

    const boxTransforms: [x: number, y: number, z: number][] = [
      [-boxSize, boxSize, 0],
      [-boxSize, 0, 0],
      [0, 0, 0],
      [boxSize, 0, 0],
    ];

    boxTransforms.forEach((boxTransform) => {
      const boxInstance = this.boxService.createBoxInstance();
      boxInstance.position.copyFromFloats(...boxTransform);
      boxInstance.setParent(jBlock);
    });

    return jBlock;
  }
}

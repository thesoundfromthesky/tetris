import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { IBlockService } from './i-block.service';
import type { TransformNode } from '@babylonjs/core';
import { ConfigService } from '../core/config.service';
import { JBlockService } from './j-block.service';
import { LBlockService } from './l-block.service';
import { OBlockService } from './o-block.service';
import { SBlockService } from './s-block.service';
import { TBlockService } from './t-block.service';
import { ZBlockService } from './z-block.service';

export interface CreateTetromino {
  createTetromino(): TransformNode;
}

@injectable()
export class TetrominoService {
  private readonly configService = injectService(ConfigService);
  private readonly iBlockService = injectService(IBlockService);
  private readonly jBlockService = injectService(JBlockService);
  private readonly lBlockService = injectService(LBlockService);
  private readonly oBlockService = injectService(OBlockService);
  private readonly sBlockService = injectService(SBlockService);
  private readonly tBlockService = injectService(TBlockService);
  private readonly zBlockService = injectService(ZBlockService);

  private tetrominoServices: CreateTetromino[] = [
    this.iBlockService,
    this.jBlockService,
    this.lBlockService,
    this.oBlockService,
    this.sBlockService,
    this.tBlockService,
    this.zBlockService,
  ];

  public activeTetromino!: TransformNode;

  public constructor() {
    this.initActiveTetromino();
  }

  private getRandomIntExclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public initActiveTetromino() {
    if (this.activeTetromino) {
      this.removeParent();
    }
    this.activeTetromino = this.createRandomTetromino();
  }

  public createRandomTetromino() {
    const max = this.tetrominoServices.length;
    const randomIndex = this.getRandomIntExclusive(0, max);

    const tetrominoService = this.tetrominoServices[randomIndex];
    const tetromino = tetrominoService.createTetromino();

    const { startingPosition } = this.configService;
    tetromino.setAbsolutePosition(startingPosition);

    return tetromino;
  }

  public removeParent() {
    this.activeTetromino.getChildMeshes().forEach((box) => {
      box.setParent(null);
    });
    this.activeTetromino.dispose();
  }
}

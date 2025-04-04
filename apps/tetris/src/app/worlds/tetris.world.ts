import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { Injector } from '../injector/injector';
import { WorldLifeCycleService } from '../core/world-life-cycle.service';
import { HemisphericLightEntity } from '../entities/lights/hemispheric-light.entity';
import { GridEntity } from '../entities/grid.entity';
import { TetrominoEntity } from '../entities/tetromino.entity';
import { InputAxisSystem } from '../systems/input-axis.system';
import { InputActionSystem } from '../systems/input-action.system';
import { QuadViewCameraEntity } from '../entities/cameras/quad-view.camera.entity';

@injectable()
export class TetrisWorld {
  private readonly injector = injectService(Injector);
  private readonly worldLifeCycleService = injectService(WorldLifeCycleService);

  public constructor() {
    this.worldLifeCycleService.onInitObservable.add(async () => {
      await this.init();
    });
  }

  private async init() {
    this.initEntities();
  }

  private initEntities() {
    this.injector.createInstances([
      QuadViewCameraEntity,
      HemisphericLightEntity,
      GridEntity,
      TetrominoEntity,
      InputAxisSystem,
      InputActionSystem,
    ]);
  }
}

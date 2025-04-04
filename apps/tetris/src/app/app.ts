import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { Injector } from './injector/injector';
import { injectable } from 'inversify';
import { CanvasService } from './core/canvas.service';
import { EngineService } from './core/engine.service';
import { SceneService } from './core/scene.service';
import { AdvancedDynamicTextureService } from './core/advanced-dynamic-texture.service';
import { injectService } from './injector/inject-service.function';
import type { Class } from 'type-fest';
import { WorldService } from './core/world.service';
import { AssetContainerService } from './core/asset-container.service';
import { WorldLifeCycleService } from './core/world-life-cycle.service';
import { TetrisWorld } from './worlds/tetris.world';
import { ConfigService } from './core/config.service';
import { InputAxisService } from './core/input-axis.service';
import { InputActionService } from './core/input-action.service';
import { BoxService } from './tetromino/box.service';
import { IBlockService } from './tetromino/i-block.service';
import { TetrominoService } from './tetromino/tetromino.service';
import { IntersectionService } from './tetromino/intersection.service';
import { DropService } from './tetromino/drop.service';
import { JBlockService } from './tetromino/j-block.service';
import { LBlockService } from './tetromino/l-block.service';
import { OBlockService } from './tetromino/o-block.service';
import { SBlockService } from './tetromino/s-block.service';
import { TBlockService } from './tetromino/t-block.service';
import { ZBlockService } from './tetromino/z-block.service';
import { ClearService } from './tetromino/clear.service';

registerBuiltInLoaders();

const injector = new Injector();
injector.container.bind(Injector).toConstantValue(injector);
injector.container.bind(CanvasService).toSelf();
injector.container.bind(EngineService).toSelf();
injector.container.bind(SceneService).toSelf();
injector.container.bind(WorldService).toSelf();
injector.container.bind(AdvancedDynamicTextureService).toSelf();
injector.container.bind(AssetContainerService).toSelf();
injector.container.bind(WorldLifeCycleService).toSelf();
injector.container.bind(ConfigService).toSelf();
injector.container.bind(InputAxisService).toSelf();
injector.container.bind(InputActionService).toSelf();
injector.container.bind(BoxService).toSelf();
injector.container.bind(IBlockService).toSelf();
injector.container.bind(JBlockService).toSelf();
injector.container.bind(LBlockService).toSelf();
injector.container.bind(OBlockService).toSelf();
injector.container.bind(SBlockService).toSelf();
injector.container.bind(TBlockService).toSelf();
injector.container.bind(ZBlockService).toSelf();
injector.container.bind(TetrominoService).toSelf();
injector.container.bind(IntersectionService).toSelf();
injector.container.bind(DropService).toSelf();
injector.container.bind(ClearService).toSelf();

@injectable()
class App {
  private readonly injector = injectService(Injector);

  public createWorld<T extends object>(world: Class<T>) {
    this.injector.createInstance(world);
  }

  public createWorlds<T extends object>(worlds: Class<T>[]) {
    worlds.forEach((world) => {
      this.createWorld(world);
    });
  }
}

async function start<T extends object>(worlds: Class<T>[]) {
  const isEmpty = worlds.length < 1;
  if (isEmpty) {
    return;
  }

  const app = injector.createInstance(App);
  app.createWorlds(worlds);
  const worldLifeCycleService = injector.getService(WorldLifeCycleService);
  await worldLifeCycleService.notifyOnInitParallel();
  const sceneService = injector.getService(SceneService);
  sceneService.runRenderLoop();

  if (import.meta.env.DEV) {
    const imports = await Promise.all([
      import('@babylonjs/core/Helpers/sceneHelpers'),
      import('@babylonjs/core/Debug/debugLayer'),
      import('@babylonjs/inspector'),
    ]);

    const { Inspector } = imports[2];
    Inspector.Show(sceneService.scene, { embedMode: true });
  }
  sceneService.focusCanvas();
}

start([TetrisWorld]);

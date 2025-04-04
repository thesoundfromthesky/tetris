import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { InputAxisService } from '../core/input-axis.service';
import { InputActionService } from '../core/input-action.service';

@injectable()
export class TetrominoEntity {
  private readonly inputAxisService = injectService(InputAxisService);
  private readonly inputActionService = injectService(InputActionService);

  public constructor() {
    this.init();
  }

  private init() {
    this.initInputAxis();
    this.initInputAction();
  }

  private initInputAxis() {
    this.inputAxisService.setInputAxis({
      ArrowRight: { scale: 1, axis: 'moveRight' },
      ArrowLeft: { scale: -1, axis: 'moveRight' },
      ArrowUp: { scale: 1, axis: 'moveForward' },
      ArrowDown: { scale: -1, axis: 'moveForward' },
      KeyW: { scale: 1, axis: 'rotateX' },
      KeyS: { scale: -1, axis: 'rotateX' },
      KeyA: { scale: 1, axis: 'rotateZ' },
      KeyD: { scale: -1, axis: 'rotateZ' },
      KeyQ: { scale: 1, axis: 'rotateY' },
      KeyE: { scale: -1, axis: 'rotateY' },
    });
  }

  private initInputAction() {
    this.inputActionService.setInputAxis({ Space: { action: 'jump' } });
  }
}

import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { InputActionService } from '../core/input-action.service';
import { DropService } from '../tetromino/drop.service';

@injectable()
export class InputActionSystem {
  private readonly inputActionService = injectService(InputActionService);
  private readonly dropService = injectService(DropService);

  public constructor() {
    this.init();
  }

  public init() {
    this.inputActionService.inputActionObservable.add(
      ({ action, isPressed }) => {
        /*     if (isGameOver) {
          return;
        }
 */
        if (action === 'jump' && isPressed) {
          this.dropService.dropHard();
        }
      }
    );
  }
}

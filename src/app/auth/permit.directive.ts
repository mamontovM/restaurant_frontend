import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs';
import {PermissionService} from './permision.service';

@Directive({
  selector: '[appPermit]'
})
export class PermitDirective implements OnChanges, OnDestroy {

  @Input() appPermit!: number;

  private sub = Subscription.EMPTY;

  constructor(private vcr: ViewContainerRef,
              private template: TemplateRef<void>,
              private permissionService: PermissionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('appPermit' in changes) {
      this.sub.unsubscribe();
      this.sub = this.permissionService.watch(this.appPermit)
        .subscribe(has => {
          if (has) {
            this.vcr.createEmbeddedView(this.template);
          } else {
            this.vcr.clear();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.vcr.clear();
  }
}

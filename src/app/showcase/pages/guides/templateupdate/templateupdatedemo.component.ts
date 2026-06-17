import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'template-update',
    templateUrl: './templateupdatedemo.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TemplateUpdateDemoComponent {
    docs = [];
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BasicDoc } from '@doc/focustrap/basicdoc';
import { ImportDoc } from '@doc/focustrap/importdoc';

@Component({
    templateUrl: './focustrapdemo.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FocusTrapDemo {
    docs = [
        {
            id: 'import',
            label: 'Import',
            component: ImportDoc
        },
        {
            id: 'basic',
            label: 'Basic',
            component: BasicDoc
        }
    ];
}

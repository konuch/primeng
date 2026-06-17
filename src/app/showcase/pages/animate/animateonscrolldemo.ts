import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ImportDoc } from '@doc/animateonscroll/importdoc';
import { BasicDoc } from '@doc/animateonscroll/basicdoc';
import { AccessibilityDoc } from '@doc/animateonscroll/accessibilitydoc';

@Component({
    templateUrl: './animateonscrolldemo.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AnimateOnScrollDemo {
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
        },
        {
            id: 'accessibility',
            label: 'Accessibility',
            component: AccessibilityDoc
        }
    ];
}

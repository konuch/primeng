import { Component, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionTextComponent } from '@layout/doc/app.docsectiontext.component';

@Component({
    selector: 'base-zindex-doc',
    template: ` <app-docsectiontext>
        <p>The <i>baseZIndex</i> is base zIndex value to use in layering. Its default value is 0.</p>
    </app-docsectiontext>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BaseZIndexDoc {}

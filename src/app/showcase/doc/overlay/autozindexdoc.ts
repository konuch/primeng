import { Component, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AppDocSectionTextComponent } from '@layout/doc/app.docsectiontext.component';

@Component({
    selector: 'auto-zindex-doc',
    template: ` <app-docsectiontext>
        <p>The <i>autoZIndex</i> determines whether to automatically manage layering. Its default value is 'false'.</p>
    </app-docsectiontext>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AutoZIndexDoc {}

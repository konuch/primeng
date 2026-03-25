import { Component } from '@angular/core';
import { ReactiveFormsDoc } from '@doc/listbox/reactiveformsdoc';
import { AccessibilityDoc } from '@doc/listbox/accessibilitydoc';
import { BasicDoc } from '@doc/listbox/basicdoc';
import { DisabledDoc } from '@doc/listbox/disableddoc';
import { FilterDoc } from '@doc/listbox/filterdoc';
import { GroupDoc } from '@doc/listbox/groupdoc';
import { ImportDoc } from '@doc/listbox/importdoc';
import { InvalidDoc } from '@doc/listbox/invaliddoc';
import { MultipleDoc } from '@doc/listbox/multipledoc';
import { StyleDoc } from '@doc/listbox/styledoc';
import { TemplateDoc } from '@doc/listbox/templatedoc';
import { VirtualScrollDoc } from '@doc/listbox/virtualscrolldoc';

@Component({
    templateUrl: './listboxdemo.html',
    standalone: false
})
export class ListboxDemo {
    docs = [
        {
            id: 'virtualscroll',
            label: 'Virtual Scroll',
            component: VirtualScrollDoc
        },
    ];
}

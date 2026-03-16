import { Component } from '@angular/core';
import { ReactiveFormsDoc } from '@doc/multiselect/reactiveformsdoc';
import { AccessibilityDoc } from '@doc/multiselect/accessibilitydoc';
import { BasicDoc } from '@doc/multiselect/basicdoc';
import { ChipsDoc } from '@doc/multiselect/chipsdoc';
import { DisabledDoc } from '@doc/multiselect/disableddoc';
import { FilterDoc } from '@doc/multiselect/filterdoc';
import { FloatLabelDoc } from '@doc/multiselect/floatlabeldoc';
import { GroupDoc } from '@doc/multiselect/groupdoc';
import { ImportDoc } from '@doc/multiselect/importdoc';
import { InvalidDoc } from '@doc/multiselect/invaliddoc';
import { StyleDoc } from '@doc/multiselect/styledoc';
import { TemplateDoc } from '@doc/multiselect/templatedoc';
import { VirtualScrollDoc } from '@doc/multiselect/virtualscrolldoc';
import { LoadingStateDoc } from '@doc/multiselect/loadingstatedoc';
import { FilledDoc } from '@doc/multiselect/filleddoc';

@Component({
    templateUrl: './multiselectdemo.html',
    styleUrls: ['./multiselectdemo.scss'],
    standalone: false
})
export class MultiSelectDemo {
    docs = [
        {
            id: 'virtualscroll',
            label: 'VirtualScroll',
            component: VirtualScrollDoc
        },
    ];
}

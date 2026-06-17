import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'calendar-local-demo',
    template: `
        <app-docsectiontext>
            <p>Locale for different languages and formats is defined globally, refer to the <a href="/configuration/#locale">PrimeNG Locale</a> configuration for more information.</p>
        </app-docsectiontext>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LocaleDoc {}

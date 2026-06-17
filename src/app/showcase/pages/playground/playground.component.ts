import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    templateUrl: './playground.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PlaygroundComponent {}

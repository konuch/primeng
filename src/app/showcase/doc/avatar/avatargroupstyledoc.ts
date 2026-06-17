import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'avatarstyle-doc',
    template: `
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Element</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>p-avatar-group</td>
                        <td>Container element.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AvatarGroupStyleDoc {}

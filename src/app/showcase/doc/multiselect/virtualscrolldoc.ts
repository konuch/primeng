import { Component, ViewChild } from '@angular/core';
import { Code } from '@domain/code';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'virtual-scroll-doc',
    styles: [`
        ::ng-deep .multiselect-custom-virtual-scroll .p-overlay {
            top: 100% !important;
        }
        ::ng-deep .multiselect-custom-virtual-scroll.open-upward .p-overlay {
            top: auto !important;
            bottom: 100% !important;
        }
    `],
    template: `
        <app-docsectiontext>
            <p>
                VirtualScrolling is an efficient way of rendering the options by displaying a small subset of data in the viewport at any time. When dealing with huge number of options, it is suggested to enable VirtualScrolling to avoid performance
                issues. Usage is simple as setting <i>virtualScroll</i> property to true and defining <i>virtualScrollItemSize</i> to specify the height of an item.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-content-center">
            <p-multiSelect
                [options]="items"
                [showToggleAll]="true"
                [selectAll]="selectAll"
                [(ngModel)]="selectedItems"
                optionLabel="label"
                [virtualScroll]="true"
                [virtualScrollItemSize]="43"
                class="multiselect-custom-virtual-scroll"
                placeholder="Select Cities"
                (onSelectAllChange)="onSelectAllChange($event)"
                (onPanelShow)="onPanelShow()"
                (onPanelHide)="onPanelHide()"
                #ms
            >
                <ng-template pTemplate="headercheckboxicon" let-allSelected let-partialSelected="partialSelected">
                    <i class="pi pi-check" *ngIf="allSelected"></i>
                    <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                </ng-template>
            </p-multiSelect>
        </div>
    `,
    standalone: false
})
export class VirtualScrollDoc {
    @ViewChild('ms') ms: MultiSelect;

    items = Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i }));

    selectedItems!: any[];

    selectAll: boolean = false;

    onSelectAllChange(event) {
        this.selectedItems = event.checked ? [...this.ms.visibleOptions()] : [];
        this.selectAll = event.checked;
    }

    private readonly MIN_DROPDOWN_HEIGHT = 150;

    onPanelShow() {
        const rect = this.ms.el.nativeElement.getBoundingClientRect();

        // The panel header (search + toggle-all) sits above the virtual scroller and
        // must be subtracted so the total panel height doesn't overflow the viewport.
        const header = this.ms.el.nativeElement.querySelector('.p-multiselect-header') as HTMLElement;
        const headerHeight = header ? header.offsetHeight : 0;

        // Usable scroller height in each direction (8px keeps a small gap from the viewport edge).
        const spaceBelow = window.innerHeight - rect.bottom - headerHeight - 8;
        const spaceAbove = rect.top - headerHeight - 8;

        // If there isn't enough room below, flip the panel upward and let CSS position it
        // above the trigger via the .open-upward class (see component styles).
        const openUpward = spaceBelow < this.MIN_DROPDOWN_HEIGHT;
        this.ms.el.nativeElement.classList.toggle('open-upward', openUpward);

        // Set the virtual scroller height directly — PrimeNG's [style] binding on p-scroller
        // takes precedence over the items-wrapper, so this is the element to target.
        const scroller = this.ms.el.nativeElement.querySelector('.p-scroller') as HTMLElement;
        if (scroller) {
            scroller.style.height = (openUpward ? spaceAbove : spaceBelow) + 'px';
        }
    }

    onPanelHide() {
        this.ms.el.nativeElement.classList.remove('open-upward');
    }
}

import { Component, viewChild, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Code } from '@domain/code';

@Component({
    selector: 'dropdown-virtualscroll-demo',
    styles: [`
        ::ng-deep .dropdown-custom-virtual-scroll .p-overlay {
            /* Force the panel to always start just below the trigger by default. */
            top: 100% !important;
        }
    `],
    template: `
        <div class="card flex justify-content-center">
            <p-dropdown
                [options]="items"
                [(ngModel)]="selectedItem"
                [filter]="true"
                placeholder="Select Item"
                class="dropdown-custom-virtual-scroll"
                (onShow)="onShow()"
                (onHide)="onHide()"
                #dd
            />
        </div>
        `,
    standalone: false
})
export class VirtualScrollDoc {
    dd = viewChild<Dropdown>('dd');

    items: SelectItem[];

    selectedItem: string | undefined;

    private readonly MIN_DROPDOWN_HEIGHT = 100;

    constructor() {
        this.items = [];
        for (let i = 0; i < 100; i++) {
            this.items.push({ label: 'Item ' + i, value: 'Item ' + i });
        }
    }

    onShow() {
        const rect = this.dd().el.nativeElement.getBoundingClientRect();

        // Dropdown may have a filter header; subtract its height so the panel doesn't overflow.
        const header = this.dd().el.nativeElement.querySelector('.p-dropdown-header') as HTMLElement;
        const headerHeight = header ? header.offsetHeight : 0;

        // Usable scroller height in each direction (8px gap from viewport edge).
        const spaceBelow = window.innerHeight - rect.bottom - headerHeight - 8;
        const spaceAbove = rect.top - headerHeight - 8;

        // Flip upward when there isn't enough room below.
        const openUpward = spaceBelow < this.MIN_DROPDOWN_HEIGHT;
        this.dd().el.nativeElement.classList.toggle('open-upward', openUpward);

        const availableHeight = (openUpward ? spaceAbove : spaceBelow) + 'px';

        // Virtual scroll uses .p-scroller (needs explicit height to drive its internal viewport).
        // Regular dropdown uses .p-dropdown-items-wrapper (needs max-height to cap the list).
        const scroller = this.dd().el.nativeElement.querySelector('.p-scroller') as HTMLElement;
        const itemsWrapper = this.dd().el.nativeElement.querySelector('.p-dropdown-items-wrapper') as HTMLElement;
        if (scroller) {
            scroller.style.height = availableHeight;
        } else if (itemsWrapper) {
            itemsWrapper.style.maxHeight = availableHeight;
        }

        if (openUpward) {
            // PrimeNG re-positions the overlay after onShow fires, so we wait one tick
            // before applying our override. setProperty('important') beats the CSS
            // `top: 100% !important` baseline set in the component styles.
            const panelHeight = headerHeight + parseFloat(availableHeight);
            setTimeout(() => {
                const overlay = this.dd()?.el.nativeElement.querySelector('.p-overlay') as HTMLElement;
                if (overlay) overlay.style.setProperty('top', `-${panelHeight}px`, 'important');
            });
        }
    }

    onHide() {
        this.dd().el.nativeElement.classList.remove('open-upward');
        // Remove the upward-position override so the CSS baseline takes back effect.
        const overlay = this.dd().el.nativeElement.querySelector('.p-overlay') as HTMLElement;
        if (overlay) overlay.style.removeProperty('top');
        // Clear any inline max-height set on the non-virtual items wrapper.
        const itemsWrapper = this.dd().el.nativeElement.querySelector('.p-dropdown-items-wrapper') as HTMLElement;
        if (itemsWrapper) itemsWrapper.style.maxHeight = '';
    }
}

import { Component, signal, viewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Listbox } from 'primeng/listbox';
import { Overlay } from 'primeng/overlay';

@Component({
    selector: 'virtual-scroll-doc',
    template: `
        <div class="card flex justify-content-center">
            <p-button #bt (onClick)="onToggle()" label="Show Overlay"></p-button>
            <p-overlay
                #overlay
                [visible]="overlayVisibleLink()"
                appendTo="body"
                [contentStyle]="{
                    height: '200px'
                }"
                [autoZIndex]="true"
                mode="overlay"
                (onBeforeShow)="onOverlayBeforeShow()"
                (onShow)="onOverlayShow($event)"
            >
                <p-listbox
                    #listbox
                    [options]="items"
                    [(ngModel)]="selectedItems"
                    [selectAll]="selectAll"
                    optionLabel="label"
                    [multiple]="true"
                    [metaKeySelection]="false"
                    (onSelectAllChange)="onSelectAllChange($event)"
                    (onChange)="onChange($event)"
                />
            </p-overlay>
        </div>
    `,
    standalone: false
})
export class VirtualScrollDoc {
    private readonly PANEL_HEIGHT = 200;

    overlay = viewChild<Overlay>('overlay');
    listbox = viewChild<Listbox>('listbox');
    button = viewChild<Button>('bt');

    overlayVisibleLink = signal(false);
    items = Array.from({ length: 1000 }, (_, i) => ({ label: `Item test #${i}`, value: i }));

    selectedItems!: any[];

    selectAll: boolean = false;

    onSelectAllChange(event) {
        this.selectedItems = event.checked ? [...this.items] : [];
        this.selectAll = event.checked;
    }

    onChange(event) {
        const { value } = event;
        if (value) this.selectAll = value.length === this.items.length;
    }

    onOverlayBeforeShow() {
        const overlayRoot = document.querySelector('.p-overlay') as HTMLElement;
        if (!overlayRoot) return;

        // Clear stale inline styles from previous adaptDropdown so PrimeNG
        // measures the overlay's natural height for correct flip detection.
        // Use a small constrained height (not empty) because the listbox has
        // 1000 items — clearing it would let PrimeNG see ~40,000px and always flip.
        overlayRoot.style.removeProperty('top');
        const scroller = overlayRoot.querySelector('.p-scroller') as HTMLElement;
        if (scroller) scroller.style.height = this.PANEL_HEIGHT + 'px';
        const itemsWrapper = overlayRoot.querySelector('.p-listbox-list-wrapper') as HTMLElement;
        if (itemsWrapper) itemsWrapper.style.maxHeight = this.PANEL_HEIGHT + 'px';
    }

    onOverlayShow($event) {
        if (!this.listbox() || !this.button()) {
            return;
        }
        const element = this.listbox().el.nativeElement as HTMLElement;
        const buttonElm = this.button().el.nativeElement as HTMLElement;
        this.adaptDropdown(
            element,
            buttonElm,
            '.p-listbox-header',
            '.p-listbox-list-wrapper',
            '.p-overlay',
            true
        );
    }

    onToggle() {
        this.overlayVisibleLink.update(v => !v);
    }

    adaptDropdown(
        rootElm: HTMLElement,
        button: string | HTMLElement,
        headerSelector: string,
        itemsWrapperSelector: string,
        overlaySelector?: string,
        openUpwardEnabled = true,
        listSelector = 'ul'
    ) {
        const GAP = 8;

        // Defer one tick so the virtual scroller has rendered after onShow.
        setTimeout(() => {
            const buttonElm = (
                typeof button === 'string' ? rootElm.querySelector(button) : button
            ) as HTMLElement;
            const buttonRect = buttonElm.getBoundingClientRect();
            const overlayRoot = overlaySelector
                ? (document.querySelector(overlaySelector) as HTMLElement)
                : rootElm;

            if (!overlayRoot) return;

            const overlayRect = overlayRoot.getBoundingClientRect();

            // PrimeNG's DomHandler.absolutePosition() sets inline transformOrigin to
            // 'bottom' (or 'center bottom') when it flips upward, 'top' when downward.
            const primengFlippedUp = overlayRoot.style.transformOrigin.includes('bottom');
            const openUpward = openUpwardEnabled && primengFlippedUp;

            // Dropdown may have a filter header; subtract its height so the panel doesn't overflow.
            const header = overlayRoot.querySelector(headerSelector) as HTMLElement;
            const headerHeight = header ? header.offsetHeight : 0;

            // Virtual scroll uses .p-scroller (needs explicit height to drive its internal viewport).
            // Regular dropdown uses items-wrapper (needs max-height to cap the list).
            const scroller = overlayRoot.querySelector('.p-scroller') as HTMLElement;
            const itemsWrapper = overlayRoot.querySelector(itemsWrapperSelector) as HTMLElement;
            const list = itemsWrapper?.querySelector(listSelector) as HTMLElement | null;
            const contentHeight = list?.scrollHeight ?? null;

            // Calculate available height based on direction.
            // Upward: from viewport top + gap to button top.
            // Downward: from overlay's actual rendered top to viewport bottom - gap.
            const availableHeight = openUpward
                ? buttonRect.top - headerHeight - GAP
                : window.innerHeight - overlayRect.top - headerHeight - GAP;

            // Use content height when items fit, otherwise stretch to viewport edge.
            const targetHeight = contentHeight !== null
                ? Math.min(contentHeight, availableHeight)
                : availableHeight;

            if (scroller) {
                scroller.style.height = targetHeight + 'px';
            } else if (itemsWrapper) {
                itemsWrapper.style.maxHeight = targetHeight + 'px';
            }

            // Reposition overlay upward: anchor top edge to viewport top + gap (in document coords).
            if (openUpward) {
                overlayRoot.style.setProperty('top', `${window.scrollY + GAP}px`, 'important');
            }
        });
    }
}

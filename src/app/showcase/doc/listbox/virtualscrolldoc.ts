import { Component, signal, viewChild } from '@angular/core';
import { Code } from '@domain/code';
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
                    heigh: '200px'
                }"
                [autoZIndex]="true"
                mode="overlay"
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
    overlay = viewChild<Overlay>('overlay')
    listbox = viewChild<Listbox>('listbox')
    button = viewChild<Button>('bt')

    overlayVisibleLink = signal(false)
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
            200,
            '.p-overlay',
            true
        )
    }

    onToggle() {
        this.overlayVisibleLink.update((v => v = !v))
    }

    adaptDropdown(
        rootElm: HTMLElement,
        button: string | HTMLElement,
        headerSelector: string,
        itemsWrapperSelector: string,
        minimumFlipHeight: number,
        overlaySelector?: string,
        openUpwardEnabled = true,
        listSelector = 'ul'
    ) {
        const buttonElm = (
            typeof button === 'string' ? rootElm.querySelector(button) : button
        ) as HTMLElement;
        const buttonRect = buttonElm.getBoundingClientRect();
        const overlayRoot = overlaySelector
            ? (document.querySelector(overlaySelector) as HTMLElement)
            : rootElm;

        // Dropdown may have a filter header; subtract its height so the panel doesn't overflow.
        const header = overlayRoot.querySelector(headerSelector) as HTMLElement;
        const headerHeight = header ? header.offsetHeight : 0;

        // Virtual scroll uses .p-scroller (needs explicit height to drive its internal viewport).
        // Regular dropdown uses .p-dropdown-items-wrapper (needs max-height to cap the list).
        const scroller = overlayRoot.querySelector('.p-scroller') as HTMLElement;
        const itemsWrapper = overlayRoot.querySelector(itemsWrapperSelector) as HTMLElement;
        const list = itemsWrapper?.querySelector(listSelector) as HTMLElement | null;
        const contentHeight = list?.scrollHeight ?? null;

        // Usable scroller height in each direction (8px gap from viewport edge).
        const spaceBelow = window.innerHeight - buttonRect.bottom - headerHeight - 8;
        const spaceAbove = buttonRect.top - headerHeight - 8;

        // Flip upward when there isn't enough room below.
        const openUpward = openUpwardEnabled && spaceBelow < minimumFlipHeight;
        const spaceToCompare = openUpward ? spaceAbove : spaceBelow;

        if (contentHeight < spaceToCompare) {
            return;
        }

        const availableHeight = openUpward ? spaceAbove : spaceBelow;

        if (scroller) {
            scroller.style.height = availableHeight + 'px';
        } else if (itemsWrapper) {
            itemsWrapper.style.maxHeight = availableHeight + 'px';
        }

        if (openUpward) {
            // const panelHeight = headerHeight + availableHeight;
            setTimeout(() => {
                if (overlayRoot) {
                    overlayRoot.style.setProperty('top', `0px`, 'important');
                }
            });
        }
    }
}

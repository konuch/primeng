import { DomHandler } from 'primeng/dom';

export class HtmlUtils {
    static getTextWidth(text: string, canvas: HTMLCanvasElement, padding = 20) {
        const context = canvas.getContext('2d');
        context.font = '14px Arial';
        const metrics = context.measureText(text);
        return metrics.width + padding;
    }

    static isElementHidden(element) {
        return element.offsetParent === null;
    }

    static isElementVisibleInContainer(
        element: HTMLElement,
        container: HTMLElement,
        options?: {
            stickyHeader?: HTMLElement; // e.g. thead
            stickyHeaderHeight?: number; // if you already know it
        }
    ) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const headerHeight =
            options?.stickyHeaderHeight ??
            options?.stickyHeader?.getBoundingClientRect().height ??
            0;

        // Effective visible area inside container (excluding the sticky header overlap)
        const visibleTop = containerRect.top + headerHeight;
        const visibleBottom = containerRect.bottom;

        // Fully visible vertically within usable area
        const isVisible = elementRect.top >= visibleTop && elementRect.bottom <= visibleBottom;

        return isVisible;
    }

    static extractTextContent(html: string) {
        return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
    }

    static isMenu(element: Element) {
        return (
            element?.role?.toLowerCase() === 'menu' || element?.role?.toLowerCase() === 'listbox'
        );
    }

    static removeStyleTagByContent(contentToMatch: string) {
        const styleTags = document.head?.getElementsByTagName('style') ?? [];

        for (let i = 0; i < styleTags.length; i++) {
            if (styleTags[i].textContent.includes(contentToMatch)) {
                styleTags[i].remove();
                break; // Stop after removing the first matching style tag
            }
        }
    }

    static haveSameAncestor(elementA: Element, elementB: Element, ancestorSelector: string) {
        const ancestor1 = elementA.closest(ancestorSelector);

        // does not have ancestor
        if (!ancestor1) {
            return false;
        }

        if (ancestor1 === elementB) {
            return true;
        }

        const ancestor2 = elementB.closest(ancestorSelector);

        if (!ancestor2) {
            return false;
        }

        return ancestor1 === ancestor2;
    }

    static adaptDropdown(
        rootElm: HTMLElement,
        button: string | HTMLElement,
        headerSelector: string,
        itemsWrapperSelector: string,
        overlaySelector?: string,
        openUpwardEnabled = true,
        listSelector = 'ul',
        gapValue = 0
    ) {
        const GAP = gapValue;

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
            const targetHeight = Math.max(
                0,
                contentHeight !== null ? Math.min(contentHeight, availableHeight) : availableHeight
            );

            if (scroller) {
                scroller.style.height = targetHeight + 'px';
            } else if (itemsWrapper) {
                itemsWrapper.style.maxHeight = targetHeight + 'px';
            }

            // Clear the fixed contentStyle height so the overlay container grows to fit.
            const overlayContent = overlayRoot.querySelector('.p-overlay-content') as HTMLElement;
            if (overlayContent) overlayContent.style.height = '';

            if (openUpward) {
                // Reposition upward: align overlay bottom with button top, clamped to viewport top.
                // Account for overlay chrome (padding/border) so the bottom edge sits flush.
                const overlayStyle = getComputedStyle(overlayRoot);
                const chrome =
                    (parseFloat(overlayStyle.paddingTop) || 0) +
                    (parseFloat(overlayStyle.paddingBottom) || 0) +
                    (parseFloat(overlayStyle.borderTopWidth) || 0) +
                    (parseFloat(overlayStyle.borderBottomWidth) || 0);
                const newTop =
                    buttonRect.top + window.scrollY - targetHeight - headerHeight - chrome;
                const clampedTop = Math.max(window.scrollY + GAP, newTop);
                const fixOffset = GAP ? clampedTop - GAP : clampedTop;
                overlayRoot.style.setProperty('top', `${fixOffset}px`, 'important');
            }
            // Downward: PrimeNG already positioned the top correctly. We only resize
            // the content area. If content is shorter than PANEL_HEIGHT, the overlay
            // simply ends earlier — no repositioning needed.
        });
    }

    static absolutePosition(
        element: HTMLElement,
        target: HTMLElement,
        gutter: boolean = true,
        keepOrientation = true
    ) {
        const elementDimensions = element.offsetParent
            ? { width: element.offsetWidth, height: element.offsetHeight }
            : DomHandler.getHiddenElementDimensions(element);
        const elementOuterHeight = elementDimensions.height;
        const elementOuterWidth = elementDimensions.width;
        const targetOuterHeight = target.offsetHeight ?? target.getBoundingClientRect().height;
        const targetOuterWidth = target.offsetWidth ?? target.getBoundingClientRect().width;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = DomHandler.getWindowScrollTop();
        const windowScrollLeft = DomHandler.getWindowScrollLeft();
        const viewport = DomHandler.getViewport();
        let top: number, left: number;
        const primengFlippedUp = element.style.transformOrigin.includes('bottom');

        if (keepOrientation) {
            if (!primengFlippedUp) {
                top = targetOuterHeight + targetOffset.top + windowScrollTop;
                element.style.transformOrigin = 'top';
            }
        } else {
            if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
                top = targetOffset.top + windowScrollTop - elementOuterHeight;
                element.style.transformOrigin = 'bottom';

                if (top < 0) {
                    top = windowScrollTop;
                }
            } else {
                top = targetOuterHeight + targetOffset.top + windowScrollTop;
                element.style.transformOrigin = 'top';
            }
        }

        if (targetOffset.left + elementOuterWidth > viewport.width)
            left = Math.max(
                0,
                targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth
            );
        else left = targetOffset.left + windowScrollLeft;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
        gutter &&
            (element.style.marginTop =
                origin === 'bottom'
                    ? 'calc(var(--p-anchor-gutter) * -1)'
                    : 'calc(var(--p-anchor-gutter))');
    }
}

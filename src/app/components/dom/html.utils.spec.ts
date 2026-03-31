import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DomHandler } from './domhandler';

import { HtmlUtils } from './html.utils';

fdescribe('Html Utils', () => {
    let utils: HtmlUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    describe('isElementHidden', () => {
        it('hidden', () => {
            // arrange
            const elm = {
                offsetParent: null,
            };

            // act
            const result = HtmlUtils.isElementHidden(elm);

            // assert
            expect(result).toEqual(true);
        });

        it('visible', () => {
            // arrange
            const elm = {
                offsetParent: 25,
            };

            // act
            const result = HtmlUtils.isElementHidden(elm);

            // assert
            expect(result).toEqual(false);
        });
    });

    describe('isElementVisibleInContainer', () => {
        describe('not visible', () => {
            it('below container', () => {
                // arrange
                const element = {
                    getBoundingClientRect: () => ({
                        top: 10,
                        bottom: 20,
                    }),
                };
                const container = {
                    getBoundingClientRect: () => ({
                        top: 0,
                        bottom: 5,
                    }),
                };

                // act
                const result = HtmlUtils.isElementVisibleInContainer(
                    element as HTMLElement,
                    container as HTMLElement
                );

                // assert
                expect(result).toEqual(false);
            });

            it('above container', () => {
                // arrange
                const element = {
                    getBoundingClientRect: () => ({
                        top: 10,
                        bottom: 26,
                    }),
                };
                const container = {
                    getBoundingClientRect: () => ({
                        top: 0,
                        bottom: 25,
                    }),
                };

                // act
                const result = HtmlUtils.isElementVisibleInContainer(
                    element as HTMLElement,
                    container as HTMLElement
                );

                // assert
                expect(result).toEqual(false);
            });
        });

        it('visible', () => {
            // arrange
            const element = {
                getBoundingClientRect: () => ({
                    top: 10,
                    bottom: 20,
                }),
            };
            const container = {
                getBoundingClientRect: () => ({
                    top: 0,
                    bottom: 25,
                }),
            };

            // act
            const result = HtmlUtils.isElementVisibleInContainer(
                element as HTMLElement,
                container as HTMLElement
            );

            // assert
            expect(result).toEqual(true);
        });

        describe('with sticky header', () => {
            it('should be invisible if element is behind sticky header', () => {
                // arrange
                const element = {
                    getBoundingClientRect: () => ({
                        top: 10,
                        bottom: 20,
                    }),
                };
                const container = {
                    getBoundingClientRect: () => ({
                        top: 0,
                        bottom: 50,
                    }),
                };
                const options = {
                    stickyHeaderHeight: 15,
                };

                // act
                const result = HtmlUtils.isElementVisibleInContainer(
                    element as HTMLElement,
                    container as HTMLElement,
                    options
                );

                // assert
                expect(result).toEqual(false);
            });

            it('should be visible if element is below sticky header', () => {
                // arrange
                const element = {
                    getBoundingClientRect: () => ({
                        top: 20,
                        bottom: 30,
                    }),
                };
                const container = {
                    getBoundingClientRect: () => ({
                        top: 0,
                        bottom: 50,
                    }),
                };
                const options = {
                    stickyHeaderHeight: 15,
                };

                // act
                const result = HtmlUtils.isElementVisibleInContainer(
                    element as HTMLElement,
                    container as HTMLElement,
                    options
                );

                // assert
                expect(result).toEqual(true);
            });

            it('should use stickyHeader element height if stickyHeaderHeight is not provided', () => {
                // arrange
                const element = {
                    getBoundingClientRect: () => ({
                        top: 10,
                        bottom: 20,
                    }),
                };
                const container = {
                    getBoundingClientRect: () => ({
                        top: 0,
                        bottom: 50,
                    }),
                };
                const stickyHeader = {
                    getBoundingClientRect: () => ({
                        height: 15,
                    }),
                };

                // act
                const result = HtmlUtils.isElementVisibleInContainer(
                    element as HTMLElement,
                    container as HTMLElement,
                    { stickyHeader: stickyHeader as HTMLElement }
                );

                // assert
                expect(result).toEqual(false);
            });
        });
    });

    describe('haveSameAncestor', () => {
        describe('true', () => {
            const expectedResult = true;

            it('default', () => {
                // arrange
                const ancestorSelector = '.my-selector';
                const ancestor = {
                    selector: '.my-selector',
                };
                const elmA = {
                    closest: (selectors: string) => ancestor,
                };
                const elmB = {
                    closest: (selectors: string) => ancestor,
                };

                // act
                const result = HtmlUtils.haveSameAncestor(
                    elmA as any,
                    elmB as any,
                    ancestorSelector
                );

                // assert
                expect(result).toEqual(expectedResult);
            });

            it('second element is ancestor itself', () => {
                // arrange
                const ancestorSelector = '.my-selector';
                const ancestor = {
                    selector: '.my-selector',
                };
                const elmA = {
                    closest: (selectors: string) => ancestor,
                };

                // act
                const result = HtmlUtils.haveSameAncestor(
                    elmA as any,
                    ancestor as any,
                    ancestorSelector
                );

                // assert
                expect(result).toEqual(expectedResult);
            });
        });

        describe('false', () => {
            const expectedResult = false;

            it('first element does not have ancestor', () => {
                // arrange
                const ancestorSelector = '.my-selector';
                const elmA = {
                    closest: (selectors: string) => null,
                };
                const elmB = {
                    closest: (selectors: string) => ({
                        selector: '.my-selector',
                    }),
                };

                // act
                const result = HtmlUtils.haveSameAncestor(
                    elmA as any,
                    elmB as any,
                    ancestorSelector
                );

                // assert
                expect(result).toEqual(expectedResult);
            });

            it('second element does not have ancestor', () => {
                // arrange
                const ancestorSelector = '.my-selector';
                const elmA = {
                    closest: (selectors: string) => ({
                        selector: '.my-selector',
                    }),
                };
                const elmB = {
                    closest: (selectors: string) => null,
                };

                // act
                const result = HtmlUtils.haveSameAncestor(
                    elmA as any,
                    elmB as any,
                    ancestorSelector
                );

                // assert
                expect(result).toEqual(expectedResult);
            });

            it('default', () => {
                // arrange
                const ancestorSelector = '.my-selector';
                const ancestor1 = {
                    selector: '.my-selector',
                };
                const ancestor2 = {
                    selector: '.my-selector',
                };
                const elmA = {
                    closest: (selectors: string) => ancestor1,
                };
                const elmB = {
                    closest: (selectors: string) => ancestor2,
                };

                // act
                const result = HtmlUtils.haveSameAncestor(
                    elmA as any,
                    elmB as any,
                    ancestorSelector
                );

                // assert
                expect(result).toEqual(expectedResult);
            });
        });
    });

    describe('adaptDropdown', () => {
        let buttonElm: any;
        let list: any;
        let itemsWrapper: any;
        let scroller: any;
        let header: any;
        let overlayContent: any;
        let setPropertySpy: jasmine.Spy;
        let rootElm: any;

        beforeEach(() => {
            buttonElm = { getBoundingClientRect: () => ({ top: 200 }) };
            list = { scrollHeight: 150 };
            itemsWrapper = { style: { maxHeight: '' }, querySelector: () => list };
            scroller = { style: { height: '' } };
            header = { offsetHeight: 30 };
            overlayContent = { style: { height: 'fixed-value' } };
            setPropertySpy = jasmine.createSpy('setProperty');

            rootElm = {
                style: { transformOrigin: 'top', setProperty: setPropertySpy },
                getBoundingClientRect: () => ({ top: 240 }),
                querySelector: (selector: string) => {
                    if (selector === '.btn') return buttonElm;
                    if (selector === '.header') return header;
                    if (selector === '.p-scroller') return scroller;
                    if (selector === '.items-wrapper') return itemsWrapper;
                    if (selector === '.p-overlay-content') return overlayContent;
                    return null;
                },
            };

            spyOn(window, 'getComputedStyle').and.returnValue({
                paddingTop: '0px',
                paddingBottom: '0px',
                borderTopWidth: '0px',
                borderBottomWidth: '0px',
            } as CSSStyleDeclaration);

            Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
        });

        it('returns early when overlaySelector yields no element', fakeAsync(() => {
            // arrange
            spyOn(document, 'querySelector').and.returnValue(null);

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                '.btn',
                '.header',
                '.items-wrapper',
                '.overlay'
            );
            tick();

            // assert
            expect(scroller.style.height).toBe('');
            expect(setPropertySpy).not.toHaveBeenCalled();
        }));

        it('sets scroller height for downward opening', fakeAsync(() => {
            // arrange
            rootElm.style.transformOrigin = 'top';

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert
            expect(scroller.style.height).toBe('150px'); // min(list.scrollHeight=150, availableHeight=600-240-30=330)
        }));

        it('sets itemsWrapper maxHeight when no scroller present', fakeAsync(() => {
            // arrange
            rootElm.querySelector = (selector: string) => {
                if (selector === '.btn') return buttonElm;
                if (selector === '.header') return header;
                if (selector === '.p-scroller') return null;
                if (selector === '.items-wrapper') return itemsWrapper;
                if (selector === '.p-overlay-content') return overlayContent;
                return null;
            };

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert
            expect(itemsWrapper.style.maxHeight).toBe('150px');
        }));

        it('clamps to availableHeight when list is taller than available space', fakeAsync(() => {
            // arrange
            list.scrollHeight = 500;
            Object.defineProperty(window, 'innerHeight', { value: 400, configurable: true });
            rootElm.getBoundingClientRect = () => ({ top: 100 });
            rootElm.querySelector = (selector: string) => {
                if (selector === '.btn') return buttonElm;
                if (selector === '.header') return header;
                if (selector === '.p-scroller') return null;
                if (selector === '.items-wrapper') return itemsWrapper;
                if (selector === '.p-overlay-content') return overlayContent;
                return null;
            };

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert
            expect(itemsWrapper.style.maxHeight).toBe('270px'); // 400 - 100 - 30
        }));

        it('clears overlayContent style height', fakeAsync(() => {
            // arrange
            overlayContent.style.height = 'fixed-value';

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert
            expect(overlayContent.style.height).toBe('');
        }));

        it('repositions overlay top when opening upward', fakeAsync(() => {
            // arrange
            rootElm.style.transformOrigin = 'center bottom';

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                '.btn',
                '.header',
                '.items-wrapper',
                undefined,
                true
            );
            tick();

            // assert
            expect(setPropertySpy).toHaveBeenCalledWith('top', jasmine.any(String), 'important');
        }));

        it('does not reposition overlay when opening downward', fakeAsync(() => {
            // arrange
            rootElm.style.transformOrigin = 'top';

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert
            expect(setPropertySpy).not.toHaveBeenCalled();
        }));

        it('accepts button as HTMLElement directly', fakeAsync(() => {
            // arrange (pass element reference instead of selector string)

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                buttonElm as HTMLElement,
                '.header',
                '.items-wrapper'
            );
            tick();

            // assert
            expect(scroller.style.height).toBe('150px');
        }));

        it('does not open upward when openUpwardEnabled is false even if overlay is flipped', fakeAsync(() => {
            // arrange
            rootElm.style.transformOrigin = 'center bottom'; // PrimeNG flipped it
            const openUpwardEnabled = false;

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                '.btn',
                '.header',
                '.items-wrapper',
                undefined,
                openUpwardEnabled
            );
            tick();

            // assert
            expect(setPropertySpy).not.toHaveBeenCalled();
        }));

        it('uses availableHeight directly when itemsWrapper has no list', fakeAsync(() => {
            // arrange — itemsWrapper.querySelector returns null → contentHeight = null
            const wrapperWithoutList = { style: { maxHeight: '' }, querySelector: () => null };
            rootElm.querySelector = (selector: string) => {
                if (selector === '.btn') return buttonElm;
                if (selector === '.header') return header;
                if (selector === '.p-scroller') return null;
                if (selector === '.items-wrapper') return wrapperWithoutList;
                if (selector === '.p-overlay-content') return overlayContent;
                return null;
            };

            // act
            HtmlUtils.adaptDropdown(rootElm as HTMLElement, '.btn', '.header', '.items-wrapper');
            tick();

            // assert — availableHeight = 600 - 240 - 30 = 330; no list so contentHeight=null → uses 330
            expect(wrapperWithoutList.style.maxHeight).toBe('330px');
        }));

        it('uses the element found by overlaySelector as overlayRoot', fakeAsync(() => {
            // arrange
            const overlaySetPropertySpy = jasmine.createSpy('overlaySetProperty');
            const overlayElement = {
                style: { transformOrigin: 'top', setProperty: overlaySetPropertySpy },
                getBoundingClientRect: () => ({ top: 300 }),
                querySelector: (selector: string) => {
                    if (selector === '.header') return header;
                    if (selector === '.p-scroller') return scroller;
                    if (selector === '.items-wrapper') return itemsWrapper;
                    if (selector === '.p-overlay-content') return overlayContent;
                    return null;
                },
            };
            spyOn(document, 'querySelector').and.returnValue(overlayElement as any);

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                '.btn',
                '.header',
                '.items-wrapper',
                '.overlay'
            );
            tick();

            // assert — overlayRect.top=300; availableHeight = 600-300-30 = 270; min(150,270)=150
            expect(scroller.style.height).toBe('150px');
        }));

        it('subtracts gapValue from available height', fakeAsync(() => {
            // arrange
            list.scrollHeight = 500; // larger than available so targetHeight = availableHeight
            const gapValue = 10;
            rootElm.querySelector = (selector: string) => {
                if (selector === '.btn') return buttonElm;
                if (selector === '.header') return header;
                if (selector === '.p-scroller') return null;
                if (selector === '.items-wrapper') return itemsWrapper;
                if (selector === '.p-overlay-content') return overlayContent;
                return null;
            };

            // act
            HtmlUtils.adaptDropdown(
                rootElm as HTMLElement,
                '.btn',
                '.header',
                '.items-wrapper',
                undefined,
                true,
                'ul',
                gapValue
            );
            tick();

            // assert — availableHeight = 600 - 240 - 30 - 10 = 320
            expect(itemsWrapper.style.maxHeight).toBe('320px');
        }));
    });

    describe('absolutePosition', () => {
        let element: any;
        let target: any;

        beforeEach(() => {
            element = {
                offsetParent: {},
                offsetWidth: 200,
                offsetHeight: 100,
                style: { transformOrigin: '', top: '', left: '', marginTop: '' },
            };
            target = {
                offsetHeight: 40,
                offsetWidth: 150,
                getBoundingClientRect: () => ({ top: 300, left: 50 }),
            };

            spyOn(DomHandler, 'getWindowScrollTop').and.returnValue(0);
            spyOn(DomHandler, 'getWindowScrollLeft').and.returnValue(0);
            spyOn(DomHandler, 'getViewport').and.returnValue({ width: 1024, height: 768 });
        });

        it('keepOrientation=true, not flipped → positions below target with top origin', () => {
            // arrange
            element.style.transformOrigin = 'top';

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(element.style.top).toBe('340px'); // targetHeight(40) + targetTop(300) + scrollTop(0)
            expect(element.style.transformOrigin).toBe('top');
        });

        it('keepOrientation=true, already flipped up → does not overwrite transformOrigin', () => {
            // arrange
            element.style.transformOrigin = 'center bottom';

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(element.style.transformOrigin).toBe('center bottom');
        });

        it('keepOrientation=false, fits below viewport → positions below with top origin', () => {
            // arrange (300+40+100=440 ≤ 768)

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, false);

            // assert
            expect(element.style.top).toBe('340px');
            expect(element.style.transformOrigin).toBe('top');
        });

        it('keepOrientation=false, overflows below viewport → positions above with bottom origin', () => {
            // arrange (300+40+100=440 > 400)
            (DomHandler.getViewport as jasmine.Spy).and.returnValue({ width: 1024, height: 400 });

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, false);

            // assert
            expect(element.style.top).toBe('200px'); // targetTop(300) - elementHeight(100)
            expect(element.style.transformOrigin).toBe('bottom');
        });

        it('keepOrientation=false, above position would be negative → clamps to windowScrollTop', () => {
            // arrange (50+40+100=190 > 100, flip: top=50-100=-50 < 0 → clamp to scrollTop=0)
            target = {
                offsetHeight: 40,
                offsetWidth: 150,
                getBoundingClientRect: () => ({ top: 50, left: 50 }),
            };
            (DomHandler.getViewport as jasmine.Spy).and.returnValue({ width: 1024, height: 100 });

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, false);

            // assert
            expect(element.style.top).toBe('0px');
        });

        it('aligns left with target when no horizontal overflow', () => {
            // arrange (50+200=250 ≤ 1024)

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(element.style.left).toBe('50px');
        });

        it('right-aligns when element overflows viewport horizontally', () => {
            // arrange (900+200=1100 > 1024, left = max(0, 900+0+150-200) = 850)
            target = {
                offsetHeight: 40,
                offsetWidth: 150,
                getBoundingClientRect: () => ({ top: 300, left: 900 }),
            };

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(element.style.left).toBe('850px');
        });

        it('uses DomHandler.getHiddenElementDimensions when element has no offsetParent', () => {
            // arrange
            element.offsetParent = null;
            spyOn(DomHandler, 'getHiddenElementDimensions').and.returnValue({
                width: 200,
                height: 100,
            });

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(DomHandler.getHiddenElementDimensions).toHaveBeenCalledWith(element);
        });

        it('sets marginTop when gutter is true', () => {
            // arrange (gutter=true)

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, true, true);

            // assert
            expect(element.style.marginTop).not.toBe('');
        });

        it('does not set marginTop when gutter is false', () => {
            // arrange (gutter=false)

            // act
            HtmlUtils.absolutePosition(element as HTMLElement, target as HTMLElement, false, true);

            // assert
            expect(element.style.marginTop).toBe('');
        });
    });

    describe('isElementFocusable', () => {
        beforeEach(() => {
            spyOn(window, 'getComputedStyle').and.returnValue({
                display: 'block',
                visibility: 'visible',
            } as CSSStyleDeclaration);
        });

        it('returns false when display is none', () => {
            // arrange
            (window.getComputedStyle as jasmine.Spy).and.returnValue({
                display: 'none',
                visibility: 'visible',
            } as CSSStyleDeclaration);
            const el = document.createElement('button');

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when visibility is hidden', () => {
            // arrange
            (window.getComputedStyle as jasmine.Spy).and.returnValue({
                display: 'block',
                visibility: 'hidden',
            } as CSSStyleDeclaration);
            const el = document.createElement('button');

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when element has hidden attribute', () => {
            // arrange — beforeEach spy returns display:'block' so the display/visibility
            // checks are bypassed; only the hasAttribute('hidden') branch causes the false return
            const el = document.createElement('div');
            el.setAttribute('hidden', '');

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when button is disabled', () => {
            // arrange
            const el = document.createElement('button');
            el.disabled = true;

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when input is disabled', () => {
            // arrange
            const el = document.createElement('input');
            el.disabled = true;

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when select is disabled', () => {
            // arrange
            const el = document.createElement('select');
            el.disabled = true;

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns false when textarea is disabled', () => {
            // arrange
            const el = document.createElement('textarea');
            el.disabled = true;

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(false);
        });

        it('returns true for a visible enabled element', () => {
            // arrange
            const el = document.createElement('button');

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(true);
        });

        it('returns true when visibility is collapse (not checked by implementation)', () => {
            // arrange — visibility:'collapse' is valid CSS (e.g. table rows) but the
            // implementation only blocks display:'none' and visibility:'hidden'
            (window.getComputedStyle as jasmine.Spy).and.returnValue({
                display: 'block',
                visibility: 'collapse',
            } as CSSStyleDeclaration);
            const el = document.createElement('button');

            // act
            const result = HtmlUtils.isElementFocusable(el);

            // assert
            expect(result).toBe(true);
        });
    });

    describe('getNextFocusableElement', () => {
        let container: HTMLElement;
        let btn1: HTMLButtonElement;
        let btn2: HTMLButtonElement;
        let btn3: HTMLButtonElement;
        let extraContainer: HTMLElement | null;

        beforeEach(() => {
            extraContainer = null;

            container = document.createElement('div');
            btn1 = document.createElement('button');
            btn2 = document.createElement('button');
            btn3 = document.createElement('button');
            container.append(btn1, btn2, btn3);
            document.body.appendChild(container);

            spyOn(window, 'getComputedStyle').and.returnValue({
                display: 'block',
                visibility: 'visible',
            } as CSSStyleDeclaration);
        });

        afterEach(() => {
            container.remove();
            extraContainer?.remove();
        });

        it('returns null when string selector matches nothing', () => {
            // arrange
            const selector = '.nonexistent-element';

            // act
            const result = HtmlUtils.getNextFocusableElement(selector, { root: container });

            // assert
            expect(result).toBeNull();
        });

        it('returns null when element is not in the focusable list', () => {
            // arrange
            const div = document.createElement('div');
            container.appendChild(div);

            // act
            const result = HtmlUtils.getNextFocusableElement(div, { root: container });

            // assert
            expect(result).toBeNull();
        });

        it('returns null when there are no focusable elements', () => {
            // arrange — btn is inside the root but getComputedStyle marks it as display:none,
            // so isElementFocusable filters it out and focusable[] is empty
            extraContainer = document.createElement('div');
            const btn = document.createElement('button');
            extraContainer.appendChild(btn);
            document.body.appendChild(extraContainer);
            (window.getComputedStyle as jasmine.Spy).and.returnValue({
                display: 'none',
                visibility: 'visible',
            } as CSSStyleDeclaration);

            // act
            const result = HtmlUtils.getNextFocusableElement(btn, { root: extraContainer });

            // assert
            expect(result).toBeNull();
        });

        it('returns the next element in forward direction', () => {
            // arrange
            const current = btn1;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, { root: container });

            // assert
            expect(result).toBe(btn2);
        });

        it('returns the previous element in reverse direction', () => {
            // arrange
            const current = btn2;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, { root: container, reverse: true });

            // assert
            expect(result).toBe(btn1);
        });

        it('wraps to first element when at the last element (forward)', () => {
            // arrange
            const current = btn3;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, { root: container });

            // assert
            expect(result).toBe(btn1);
        });

        it('wraps to last element when at the first element (reverse)', () => {
            // arrange
            const current = btn1;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, { root: container, reverse: true });

            // assert
            expect(result).toBe(btn3);
        });

        it('returns null at the last element when wrap is false', () => {
            // arrange
            const current = btn3;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, { root: container, wrap: false });

            // assert
            expect(result).toBeNull();
        });

        it('returns null at the first element when reverse and wrap is false', () => {
            // arrange
            const current = btn1;

            // act
            const result = HtmlUtils.getNextFocusableElement(current, {
                root: container,
                reverse: true,
                wrap: false,
            });

            // assert
            expect(result).toBeNull();
        });

        it('accepts a string CSS selector to identify the current element', () => {
            // arrange
            btn1.id = 'focus-btn-1';

            // act
            const result = HtmlUtils.getNextFocusableElement('#focus-btn-1', { root: container });

            // assert
            expect(result).toBe(btn2);
        });

        it('uses custom root to scope the focusable query', () => {
            // arrange
            extraContainer = document.createElement('div');
            const subBtn1 = document.createElement('button');
            const subBtn2 = document.createElement('button');
            extraContainer.append(subBtn1, subBtn2);
            document.body.appendChild(extraContainer);

            // act
            const result = HtmlUtils.getNextFocusableElement(subBtn1, { root: extraContainer });

            // assert
            expect(result).toBe(subBtn2);
        });

        it('skips non-focusable elements', () => {
            // arrange
            (window.getComputedStyle as jasmine.Spy).and.callFake((el: Element) => {
                if (el === btn2) {
                    return { display: 'none', visibility: 'visible' } as CSSStyleDeclaration;
                }
                return { display: 'block', visibility: 'visible' } as CSSStyleDeclaration;
            });

            // act
            const result = HtmlUtils.getNextFocusableElement(btn1, { root: container });

            // assert
            expect(result).toBe(btn3);
        });
    });
});

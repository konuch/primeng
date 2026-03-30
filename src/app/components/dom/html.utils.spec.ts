import { TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { HtmlUtils } from './html.utils';

describe('Html Utils', () => {
    let utils: HtmlUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore()],
            imports: [],
        });
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
});

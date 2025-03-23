import { IFilterConfig } from "@/interfaces";
import { AppDispatch } from "@/stores/store";
import { fetchAutocompleteOptions } from "@/stores/slices/autocompleteSlice";

export const prefetchedEntityTypes = new Set<string>();

export const prefetchFilterData = (
    filters: IFilterConfig[],
    dispatch: AppDispatch,
    maxPrefetch: number = 3
) => {
    const filtersToPrefetch = filters
        .filter(f => f.itemRef && !prefetchedEntityTypes.has(f.itemRef))
        .slice(0, maxPrefetch);

    filtersToPrefetch.forEach(f => {
        if (f.itemRef) {
            prefetchedEntityTypes.add(f.itemRef);
        }
    });

    filtersToPrefetch.forEach((filter, index) => {
        if (filter.itemRef) {
            setTimeout(() => {
                dispatch(fetchAutocompleteOptions({
                    entityType: filter.itemRef,
                    limit: 100
                }));
            }, index * 300);
        }
    });
};

export const prefetchSingleFilter = (
    filter: IFilterConfig,
    dispatch: AppDispatch
) => {
    if (filter.itemRef && !prefetchedEntityTypes.has(filter.itemRef)) {
        prefetchedEntityTypes.add(filter.itemRef);

        dispatch(fetchAutocompleteOptions({
            entityType: filter.itemRef,
            limit: 100
        }));
    }
};

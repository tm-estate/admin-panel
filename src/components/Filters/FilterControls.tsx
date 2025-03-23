import React from 'react';
import BaseButton from '@/components/Base/BaseButton';

interface FilterControlsProps {
    handleApplyFilters: () => Promise<boolean>;
    handleResetFilters: () => void;
    hasFilters: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
                                                           handleApplyFilters,
                                                           handleResetFilters,
                                                           hasFilters
                                                       }) => {
    return (
        <div className="flex mt-2">
            <BaseButton
                className="mr-3"
                type="button"
                color="success"
                label="Apply Filters"
                onClick={handleApplyFilters}
                disabled={!hasFilters}
            />
            <BaseButton
                type="button"
                color="info"
                label="Reset All"
                onClick={handleResetFilters}
                disabled={!hasFilters}
            />
        </div>
    );
};

export default React.memo(FilterControls);

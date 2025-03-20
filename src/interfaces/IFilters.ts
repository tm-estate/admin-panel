export interface IFilterItemFields {
    selectedField: string;
    filterValue: string;
    filterBooleanValue: boolean;
    filterValueFrom: string | number;
    filterValueTo: string | number;
}

export interface IFilterConfig {
    label: string;
    key: string;
    selectType: 'search' | 'select' | 'multi' | 'boolean' | 'number' | 'date' | 'text';
    options?: any[];
    itemRef?: string;
    showField?: string;
}

export interface IFilterItem {
    id: string;
    fields: IFilterItemFields
    config?: IFilterConfig;
}

export interface IFilterFieldProps {
    filterItem: IFilterItem;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched?: (field: string, touched: boolean) => void;
    handleFilterValueChange: (id: string, name: string, value: any) => void;
    controlClasses?: string;
    errorClasses: string;
    touched?: Record<string, boolean>;
    errors?: Record<string, string>;
}

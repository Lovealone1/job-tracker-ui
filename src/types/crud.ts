import { z } from 'zod';

export type FormFieldType = 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'file';

export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    options?: { label: string; value: string | number }[]; // For select arrays
}

export interface TableColumn<T> {
    header: string;
    accessorKey: keyof T | string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export interface CrudEntityConfig<T = any, CreateDTO = any, UpdateDTO = CreateDTO> {
    entityKey: string;           // E.g. 'proteins'
    title: string;               // E.g. 'Proteínas'
    singularTitle: string;       // E.g. 'Proteína'
    endpoints: {
        base: string;            // E.g. '/proteins' -> /api/v1/proteins
    };
    columns: TableColumn<T>[];
    formFields: FormField[];
    formSchema: z.ZodType<any, any>;
    defaultValues: Partial<CreateDTO>;
}

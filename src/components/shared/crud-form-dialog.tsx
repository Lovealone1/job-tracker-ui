import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CrudEntityConfig, FormField } from '@/types/crud';
import { cn } from '@/lib/utils';

interface CrudFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    config: CrudEntityConfig;
    initialData?: any;
    isLoading?: boolean;
}

export function CrudFormDialog({
    isOpen,
    onClose,
    onSubmit,
    config,
    initialData,
    isLoading = false,
}: CrudFormDialogProps) {
    const [formData, setFormData] = React.useState<any>({});
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || config.defaultValues || {});
            setErrors({});
        }
    }, [isOpen, initialData, config.defaultValues]);

    if (!isOpen) return null;

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        // Clear error for field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        if (!config.formSchema) return true;
        const result = config.formSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0];
                if (path) {
                    formattedErrors[path.toString()] = issue.message;
                }
            });
            setErrors(formattedErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    const isEdit = !!initialData;

    const renderField = (field: FormField) => {
        const value = formData[field.name] !== undefined ? formData[field.name] : '';
        const error = errors[field.name];

        const baseInputClasses = cn(
            "w-full px-3 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-colors disabled:opacity-50",
            error ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
        );

        return (
            <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {field.label}
                </label>

                {field.type === 'text' && (
                    <input
                        type="text"
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseInputClasses}
                        disabled={isLoading}
                    />
                )}

                {field.type === 'number' && (
                    <input
                        type="number"
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(e) => handleChange(field.name, Number(e.target.value))}
                        className={baseInputClasses}
                        disabled={isLoading}
                    />
                )}

                {field.type === 'textarea' && (
                    <textarea
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={cn(baseInputClasses, "min-h-[60px] resize-none")}
                        disabled={isLoading}
                    />
                )}

                {field.type === 'select' && field.options && (
                    <select
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseInputClasses}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select {field.label.toLowerCase()}</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                )}

                {field.type === 'boolean' && (
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleChange(field.name, e.target.checked)}
                            disabled={isLoading}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-white"
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Active</span>
                    </label>
                )}

                {field.type === 'file' && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleChange(field.name, file);
                            }}
                            className={cn(
                                "block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#A600FF] file:text-white hover:file:bg-[#8B00D6] transition-all",
                                error ? 'border-red-500' : ''
                            )}
                            disabled={isLoading}
                        />
                        <span className="text-[10px] text-zinc-400 font-medium">Coming soon: Cloud storage integration</span>
                    </div>
                )}

                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
            <div
                className="w-full max-w-[95vw] lg:max-w-[90vw] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8"
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                        {isEdit ? 'Edit' : 'Create'} {config.singularTitle}
                    </h2>
                    {!isLoading && (
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        {config.formFields.map((field) => (
                            <div key={field.name} className={cn(
                                field.type === 'textarea' || field.type === 'file' ? "md:col-span-2 lg:col-span-4" : ""
                            )}>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#A600FF] rounded-lg hover:bg-[#8B00D6] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isEdit ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

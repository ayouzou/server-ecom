import { get } from 'lodash';
import { FieldError, FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form';


interface Props {
    name: string
    id?: string
    label: string
    placeholder?: string
    validation?: RegisterOptions<any, any> | undefined
    defaultValue?: string
    register: UseFormRegister<any>;
    errors?: FieldErrors<Record<string, any>>;
    type?: string
}


export default function Input({ id, name, type, placeholder, validation, defaultValue, register, errors, label }: Props){
    const error = get(errors, name);
    const errorMessage = getErrorMessage(label, error as FieldError);

    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-0 py-1.5 px-2 bg-white shadow-sm ring-1 ring-inset ring-gray-300 text-black focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register(name, validation)}
                    defaultValue={defaultValue}
                />
                {errors && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errorMessage}</p>)}
            </div>
        </div>
    )
}

const getErrorMessage = (
    label: string,
    error: FieldError | undefined
) => {
    if (['required', 'custom'].includes(error?.type as string)) {
        return `${label?.charAt(0).toUpperCase() + label?.slice(1)} is required`;
    } else if (error?.type === 'pattern') {
        return `${label?.charAt(0).toUpperCase() + label?.slice(1)} is not valid`;
    } else if (error?.type === 'minLength') {
        return `${label?.charAt(0).toUpperCase() + label?.slice(1)} must be at least ${error.types?.minLength?.toString() || ""} characters`;
    }
    else if (error?.type === 'maxLength') {
        return `${label?.charAt(0).toUpperCase() + label?.slice(1)} must be at smaller ${error.types?.maxLength?.toString() || ""} characters`;
    }
    return '';
};
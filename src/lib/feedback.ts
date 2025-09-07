import { toast, type ToastOptions } from "react-hot-toast";
import type { JSX } from "react";

type PromiseMessages<T> =
    | {
    loading: string;
    success: string;
    error: string;
}
    | {
    loading: string;
    success: (value: T) => string | JSX.Element;
    error: (err: unknown) => string | JSX.Element;
};

type PromiseOptions = {
    loading?: ToastOptions;
    success?: ToastOptions;
    error?: ToastOptions;
};

const defaultToastOptions: ToastOptions = {
    duration: 4000,
    position: 'top-center',
    style: {
        borderRadius: '8px',
        padding: '16px',
        color: '#FFFFFF', 
    },
};

export const feedback = {
    // Basic toasts
    success(message: string, opts?: ToastOptions) {
        return toast.success(message, {
            ...defaultToastOptions,
            ...opts,
        });
    },
    error(message: string, opts?: ToastOptions) {
        return toast.error(message, {
            ...defaultToastOptions,
            ...opts,
        });
    },
    info(message: string, opts?: ToastOptions) {
        return toast(message, opts);
    },
    loading(message: string, opts?: ToastOptions) {
        return toast.loading(message, opts);
    },

    // Promise wrapper with consistent loading/success/error
    promise<T>(p: Promise<T>, msgs: PromiseMessages<T>, opts?: PromiseOptions) {
        return toast.promise<T>(p, msgs, opts);
    },

    // Programmatic controls
    dismiss(id?: string) {
        toast.dismiss(id);
    },
    remove(id?: string) {
        toast.remove(id);
    },
};

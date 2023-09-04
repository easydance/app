import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NgForm, ValidationErrors, Validator } from '@angular/forms';

export function getFormValidationErrors(ngForm: NgForm) {
    const errors: any = {};
    const controls = ngForm.controls;
    if (controls) {
        Object.keys(controls).forEach(key => {
            const controlErrors: ValidationErrors = controls[key].errors || {};
            if (controlErrors != null) {
                errors[key] = {};
                Object.keys(controlErrors).forEach(keyError => {
                    if (controlErrors[keyError]) {
                        errors[key][keyError] = true;
                    }
                });
            }
        });
        const formErrors = ngForm.form.errors;
        for (let key in formErrors) {
            if (errors[key]) {
                errors[key] = {
                    ...errors[key],
                    ...formErrors[key]
                };
            } else {
                errors[key] = formErrors[key];
            }
        }
        return errors;
    }
    return {};
}

export enum IComparator {
    EQUALS,
    VALID_EMAIL
}

export type IValidatorWithComparatorConfig = {
    key: string;
    keyError?: string;
    comparator: IComparator;
    inputs: string[];
    messageError?: string;
};

type IValidatorWithFunctionConfig = {
    key: string;
    keyError: string;
    comparator: ((form: AbstractControl) => boolean);
    messageError?: string;
};

export type IValidatorConfig = IValidatorWithComparatorConfig | IValidatorWithFunctionConfig;

@Directive({
    selector: '[validators]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ValidatorsDirective, multi: true }],
    standalone: true
})
export class ValidatorsDirective implements Validator {

    @Input() validators: IValidatorConfig[] = [];

    constructor() {
    }

    registerOnValidatorChange(fn: () => void): void {
    }

    validate(form: AbstractControl): ValidationErrors | null {
        if (!this.validators) {
            return undefined as any;
        }
        let errors: any = {};
        for (const va of this.validators) {
            const error = this.getError(form, va);
            if (error) {
                if (errors[va.key]) {
                    errors[va.key] = {
                        ...errors[va.key],
                        ...error
                    };
                } else {
                    errors[va.key] = error;
                }
            }
        }

        if (Object.keys(errors).length === 0) {
            return null;
        }
        return errors;
    }

    private getError(form: AbstractControl, validator: IValidatorConfig): Record<string, string | boolean> | undefined {

        if (typeof validator.comparator === 'function') {
            return !validator.comparator(form) ? { [validator.keyError]: validator.messageError || true } : undefined;
        }
        switch (validator.comparator) {
            case IComparator.EQUALS:
                if (!validator.inputs.map(i => form.get(i)?.value).every((v, i, arr) => v == arr[0])) {
                    return { [validator.keyError || 'not-same-values']: validator.messageError || 'NOT_EQUALS' };
                }
                break;
            case IComparator.VALID_EMAIL:
                const value = form.get(validator.inputs[0])?.value;
                if (!new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value || '')) {
                    return { [validator.keyError || 'invalid-email-format']: validator.messageError || 'INVALID EMAIL' };
                }
                break;
        }
        return undefined;
    }

}
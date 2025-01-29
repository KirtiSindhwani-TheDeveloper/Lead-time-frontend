import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to ensure at least one checkbox is selected
export function atLeastOneCheckedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = control.value;
    const isChecked = Object.values(values).some(value => value === true); // Checks if at least one value is true
    return isChecked ? null : { atLeastOneChecked: true }; // Return error if none are selected
  };
}

import * as React from 'react';
import { getter } from '@progress/kendo-react-common';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const phoneRegex = new RegExp(/^[0-9 ()+-]+$/);
const ccardRegex = new RegExp(/^[0-9-]+$/);
const cvcRegex = new RegExp(/^[0-9]+$/);

// These validator methods are to be used for generic fields and are to have generic error messages. 
// ex: Date fields, Text fields, People Picker fields. 
//#region Generic Field Validators. 
export const required = value => value ? "" : "A value is required.";

export const dateValidator = value => value ? "" : "Date is Required.";

export const peoplePickerValidator = value => value ? "" : "Select one or more users.";
//#endregion


// These validator methods are to be used for specific/ custom fields.  The error messages are meant to be unique to the given field. 
// ex: Customer field in the Submit AR Invoice Form. 
//#region Specific Field Validators. 
export const requiresCustomer = value => value ? "" : "Please select a customer or manually enter customer details.";
export const requireCustomerName = value => value ? "" : "Please enter a customer name.";
/**
 * 'value' is the masked input from the form.
 * Initially it will be null.  After the user has made any change to value it will be '___-__-___-_____-____'
 * As the user enters their GL Code the '_' characters will be replaced with their numbers.
 *
 * We cannot check the length of the input to validate it without stripping away all the '-' characters.
 * Instead to validate the GL Code for length I'm going on the assumption that once all '_' characters are gone the user has entered the entire code.
 */
export const glCodeValidator = (value) => !value ? "G/L Account # is required." : value.includes('_') ? "G/L Account # is too short." : "";
//#endregion

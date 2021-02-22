import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';
import { Button } from '@progress/kendo-react-buttons';
import { IARInvoice } from '../../../interfaces/IARInvoice';
import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';

/**
 * This class displays the generic invoice metadata. 
 */
export class InvoiceComponent extends React.Component<IArInvoiceSubComponentProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Customer Details</b></CardTitle>
                    <Label>Name:</Label>

                </CardBody>
            </Card>
        );
    }
}
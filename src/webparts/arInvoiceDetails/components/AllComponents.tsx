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
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';

import { AccountCodeListComponent } from '../../submitNewArInvoiceForm/components/AccountCodeListComponent';
import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { RequestComponent } from './RequestComponent';
import { InvoiceComponent } from './InvoiceComponent';
import { ApprovalsComponent } from './ApprovalsComponent';
import { AccountsComponent } from './AccountsComponent';
import { AttachmentsComponent } from './AttachmentsComponent';

/**
 * This class displays the account details of an invoice. 
 */
export class AllComponents extends React.Component<IArInvoiceSubComponentProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div style={{ width: '100%' }}>
                <div className='row'>
                    <div className='col-sm-12'>
                        <RequestComponent {...this.props} />
                    </div>
                </div>
                <InvoiceComponent {...this.props} />
                <ApprovalsComponent {...this.props} />
                <AccountsComponent {...this.props} />
                <AttachmentsComponent {...this.props} />
            </div>
        );
    }
}
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
            <div>
                <div className='row'>
                    <div className='col-lg-4 col-md-12' >
                        <RequestComponent invoice={this.props.invoice} />
                    </div>
                    <div className='col-lg-7 col-md-12' >
                        <InvoiceComponent invoice={this.props.invoice} />
                    </div>
                </div>

                <div className='row'>
                    <div className='col-lg-4 col-md-12'>
                        <ApprovalsComponent invoice={this.props.invoice} />
                    </div>
                    <div className='col-lg-7 col-md-12'>
                        <AccountsComponent invoice={this.props.invoice} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <AttachmentsComponent invoice={this.props.invoice} />
                    </div>
                </div>

            </div>
        );
    }
}
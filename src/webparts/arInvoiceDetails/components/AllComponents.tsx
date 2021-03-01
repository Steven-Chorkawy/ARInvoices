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
import { GetInvoiceByID, UpdateARInvoice, DeleteARInvoiceAccounts } from '../../../MyHelperMethods/DataLayerMethods';
import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import IDataOperations from '../../../interfaces/IDataOperations';
import { RequestComponent } from './RequestComponent';
import { CustomerComponent } from './CustomerComponent';
import { ApprovalsComponent } from './ApprovalsComponent';
import { AccountsComponent } from './AccountsComponent';
import { AttachmentsComponent } from './AttachmentsComponent';

interface IAllComponentsProps extends IArInvoiceSubComponentProps {
    AccountCRUD?: IDataOperations;
}

/**
 * This class displays the account details of an invoice. 
 */
export class AllComponents extends React.Component<IAllComponentsProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div style={{ width: '100%' }}>
                <RequestComponent {...this.props} />
                <CustomerComponent {...this.props} />
                <ApprovalsComponent {...this.props} />
                <AccountsComponent
                    {...this.props}
                    {...this.props.AccountCRUD ? this.props.AccountCRUD : undefined}
                />
                <AttachmentsComponent {...this.props} />
            </div>
        );
    }
}
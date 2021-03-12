import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { FieldArray } from '@progress/kendo-react-form';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';

import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import * as MyFormComponents from '../../../components/MyFormComponents';
import IDataOperations from '../../../interfaces/IDataOperations';

export interface IAccountsComponentProps extends IArInvoiceSubComponentProps, IDataOperations {
    
}

/**
 * This class displays the account details of an invoice. 
 */
export class AccountsComponent extends React.Component<IAccountsComponentProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Accounts</b></CardTitle>
                    <FieldArray
                        name='Accounts'
                        component={MyFormComponents.FormAccountListView}
                        {...this.props}
                    />
                </CardBody>
            </Card>
        );
    }
}
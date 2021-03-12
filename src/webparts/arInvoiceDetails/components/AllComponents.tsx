import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import IDataOperations from '../../../interfaces/IDataOperations';
import { RequestComponent } from './RequestComponent';
import { CustomerComponent } from './CustomerComponent';
import { ApprovalsComponent } from './ApprovalsComponent';
import { AccountsComponent } from './AccountsComponent';
import { AttachmentsComponent } from './AttachmentsComponent';

interface IAllComponentsProps extends IArInvoiceSubComponentProps {
    AccountCRUD?: IDataOperations;
    AttachmentCRUD?: IDataOperations;
    handleApprovalResponse: Function;
    handleApprovalCreate: Function;
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
                <ApprovalsComponent
                    {...this.props}
                    context={this.props.context}
                    handleApprovalResponse={this.props.handleApprovalResponse}
                    handleApprovalCreate={this.props.handleApprovalCreate}
                />
                <AccountsComponent
                    {...this.props}
                    {...this.props.AccountCRUD ? this.props.AccountCRUD : undefined}
                />
                <AttachmentsComponent
                    {...this.props}
                    {...this.props.AttachmentCRUD ? this.props.AttachmentCRUD : undefined}
                />
            </div>
        );
    }
}
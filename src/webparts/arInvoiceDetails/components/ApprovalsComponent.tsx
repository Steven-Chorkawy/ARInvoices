import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';

import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { ApprovalCardComponent } from '../../../components/ApprovalCardComponent';

interface IApprovalComponentProps extends IArInvoiceSubComponentProps {
    handleApprovalResponse: Function;
}

/**
 * This class displays the approval requests and status
 */
export class ApprovalsComponent extends React.Component<IApprovalComponentProps> {
    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Approval Requests</b></CardTitle>
                    {this.props.invoice.Approvals.map(approval => {
                        return (
                            <ApprovalCardComponent
                                invoice={this.props.invoice}
                                approval={approval}
                                handleApprovalResponse={this.props.handleApprovalResponse}
                            />
                        );
                    })}
                </CardBody>
            </Card>
        );
    }
}
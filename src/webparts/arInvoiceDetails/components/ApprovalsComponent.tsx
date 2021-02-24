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


/**
 * This class displays the approval requests and status
 */
export class ApprovalsComponent extends React.Component<IArInvoiceSubComponentProps> {
    constructor(props) {
        super(props);
    }

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
                            />
                        );
                    })}
                </CardBody>
            </Card>
        );
    }
}
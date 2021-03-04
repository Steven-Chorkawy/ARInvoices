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
import { Button } from '@progress/kendo-react-buttons';
import RequestApprovalSidePanel from '../../../components/RequestApprovalSidePanel';

interface IApprovalComponentProps extends IArInvoiceSubComponentProps {
    handleApprovalResponse: Function;
    handleApprovalCreate: Function;
    context: any;
}

/**
 * This class displays the approval requests and status
 */
export class ApprovalsComponent extends React.Component<IApprovalComponentProps, any> {
    private onRequestApprovalButtonClick = () => this.setState({ showApprovalSidePanel: true });


    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Approval Requests</b></CardTitle>
                    {
                        this.props.context &&
                        <div>
                            <Button icon={'plus'} primary={true} look={'flat'} onClick={this.onRequestApprovalButtonClick}>Request Approval</Button>
                        </div>
                    }
                    {this.props.invoice.Approvals && this.props.invoice.Approvals.map(approval => {
                        return (
                            <ApprovalCardComponent
                                invoice={this.props.invoice}
                                approval={approval}
                                handleApprovalResponse={this.props.handleApprovalResponse}
                            />
                        );
                    })}
                    {
                        this.state && this.state.showApprovalSidePanel && this.props.context &&
                        <RequestApprovalSidePanel
                            invoiceId={this.props.invoice.ID}
                            isOpen={this.state.showApprovalSidePanel}
                            context={this.props.context}
                            onSubmitCallBack={this.props.handleApprovalCreate}
                        />
                    }
                </CardBody>
            </Card>
        );
    }
}
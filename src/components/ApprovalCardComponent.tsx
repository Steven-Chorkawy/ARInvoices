import * as React from 'react';

import { Card, CardBody, CardSubtitle, CardTitle } from '@progress/kendo-react-layout';

import { IARInvoice, IApproval } from '../interfaces/IARInvoice';
import * as ApprovalEnum from '../enums/Approvals';

export interface IApprovalCardComponent {
    invoice: IARInvoice;
    approval: IApproval;
};

const parseActionType = (action: IApproval) => {
    let output = 'k-i-info';
    switch (action.Request_x0020_Type) {
        case ApprovalEnum.ApprovalRequestTypes["Department Approval Required"]:
        case ApprovalEnum.ApprovalRequestTypes["Accountant Approval Required"]:
        case ApprovalEnum.ApprovalRequestTypes["Accounting Clerk2 Approval Required"]:
            output = 'k-i-check';
            break;
        case ApprovalEnum.ApprovalRequestTypes["Edit Required"]:
            output = 'k-i-edit';
            break;
        default:
            break;
    }

    if (action.Status === ApprovalEnum.ApprovalStatus.Reject || action.Status === ApprovalEnum.ApprovalStatus.Cancel) {
        output = 'k-i-close';
    }

    return output;
};

export class ApprovalCardComponent extends React.Component<IApprovalCardComponent, any> {
    constructor(props) {
        super(props);
    }



    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardSubtitle>
                        <b title={this.props.approval.Status}><span className={`k-icon ${parseActionType(this.props.approval)}`}></span> | {this.props.approval.Request_x0020_Type}</b>
                    </CardSubtitle>
                    <div>
                        {this.props.approval.Assigned_x0020_To.Title} | {this.props.approval.Status}
                    </div>
                </CardBody>
            </Card>
        );
    }
}
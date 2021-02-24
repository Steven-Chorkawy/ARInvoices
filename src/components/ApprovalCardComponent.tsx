import * as React from 'react';

import { Card, CardActions, CardBody, CardSubtitle, CardTitle } from '@progress/kendo-react-layout';

import { IARInvoice, IApproval } from '../interfaces/IARInvoice';
import * as ApprovalEnum from '../enums/Approvals';
import MyDate from './MyDate';

import { Button } from '@progress/kendo-react-buttons';

export interface IApprovalCardComponentProps {
    invoice: IARInvoice;
    approval: IApproval;
}

export interface IApprovalCardComponentState {
    showMore: boolean;
}

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

const parseActionStatus = (action: IApproval) => {
    let output = '';
    switch (action.Status) {
        case ApprovalEnum.ApprovalStatus.Waiting:
            output = 'k-state-info';
            break;
        case ApprovalEnum.ApprovalStatus.Approve:
            output = 'k-state-success';
            break;
        case ApprovalEnum.ApprovalStatus.Cancel:
        case ApprovalEnum.ApprovalStatus.Reject:
            output = 'k-state-error';
            break;
        default:
            output = '';
            break;
    }
    return output;
};

export class ApprovalCardComponent extends React.Component<IApprovalCardComponentProps, IApprovalCardComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            showMore: false
        };
    }

    public render() {
        return (
            <Card style={{ width: '100%', marginBottom: '5px' }}>
                <CardBody className={parseActionStatus(this.props.approval)}>
                    <CardSubtitle>
                        <b title={this.props.approval.Status}><span className={`k-icon ${parseActionType(this.props.approval)}`}></span> | {this.props.approval.Request_x0020_Type}</b>
                    </CardSubtitle>
                </CardBody>
                <CardBody>
                    <div>
                        {this.props.approval.Status === ApprovalEnum.ApprovalStatus.Waiting ? `Waiting for ` : `${this.props.approval.Status} by `}
                        <b>{this.props.approval.Assigned_x0020_To.Title} </b>
                        <MyDate date={this.props.invoice.Modified} />
                        {/* <Moment
                            className={'k-card-subtitle'}
                            date={this.props.approval.Modified}      // The date to be used.
                            format={'MM/DD/YYYY'}       // Date format. 
                            withTitle={true}            // Show Title on hover.
                            titleFormat={'D MMM YYYY'}  // Title format
                            fromNow={true}              // Display number of hours since date.
                            fromNowDuring={7200000}    // Only display fromNow if it is less than the milliseconds provided here. 7200000 = 2 hours.
                        /> */}
                    </div>
                </CardBody>
                {
                    this.state.showMore &&
                    <CardBody style={{ wordWrap: 'break-word' }}>
                        <div>
                            Requested by <b>{this.props.approval.Author.Title} </b>
                            <MyDate date={this.props.approval.Created} />
                            {/* <Moment
                                className={'k-card-subtitle'}
                                date={this.props.approval.Created}        // The date to be used.
                                format={'MM/DD/YYYY'}       // Date format. 
                                withTitle={true}            // Show Title on hover.
                                titleFormat={'D MMM YYYY'}  // Title format
                                fromNow={true}              // Display number of hours since date.
                                fromNowDuring={7200000}     // Only display fromNow if it is less than the milliseconds provided here. 7200000 = 2 hours.
                            /> */}
                        </div>
                        <div>
                            {this.props.approval.Notes}
                        </div>
                        <hr />
                        <div>
                            {this.props.approval.Response_x0020_Summary}
                        </div>
                    </CardBody>
                }
                <CardActions orientation='vertical'>
                    <Button look='flat' onClick={() => this.setState({ showMore: !this.state.showMore })}>{this.state.showMore ? 'Hide' : 'Show More'}</Button>
                </CardActions>
            </Card>
        );
    }
}
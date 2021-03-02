import * as React from 'react';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { Card, CardActions, CardBody, CardSubtitle, CardTitle } from '@progress/kendo-react-layout';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';

import { IARInvoice, IApproval } from '../interfaces/IARInvoice';
import * as ApprovalEnum from '../enums/Approvals';
import MyDate from './MyDate';

import { Button } from '@progress/kendo-react-buttons';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { GetUserByLoginName, GetUserProfileProperties } from '../MyHelperMethods/UserProfileMethods';

export interface IApprovalCardComponentProps {
    invoice: IARInvoice;
    approval: IApproval;
}

export interface IApprovalCardComponentState {
    showMore: boolean;
    currentUser?: any;
    responseText?: string;
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

        sp.web.currentUser.get().then(user => {
            // Making this call just to get the users ID. 
            GetUserByLoginName(user.LoginName).then(userByLoginName => {
                GetUserProfileProperties(
                    user.LoginName,
                    values => { this.setState({ currentUser: { ...values, Id: userByLoginName.Id } }); }
                );
            });
        });
    }

    private _PromptForApproval = (): boolean => {
        if (this.state.currentUser) {
            return this.state.currentUser.Email === this.props.approval.Assigned_x0020_To.EMail && this.props.approval.Status === ApprovalEnum.ApprovalStatus.Waiting;
        }
        else {
            return false;
        }
    }

    /**
     * Validate if the user is allowed to submit this response then call the parents save method. 
     * If Reject - A response must be present.
     * If Approve - An account code must be present. 
     * @param response Approve or Reject
     */
    private handleResponse = (response: string | ApprovalEnum.ApprovalStatus): void => {
        // TODO: Call a method passed through props that will handle the save logic. 
        console.log(response);
    }

    public render() {
        return (
            <Card style={{ width: '100%', marginBottom: '5px' }}>
                <CardBody className={parseActionStatus(this.props.approval)}>
                    <CardSubtitle>
                        <b title={this.props.approval.Status}><span className={`k-icon ${parseActionType(this.props.approval)}`}></span> | {this.props.approval.Request_x0020_Type}</b>
                        <Button look='flat' onClick={() => this.setState({ showMore: !this.state.showMore })}>{this.state.showMore ? 'Hide' : 'Show More'}</Button>
                    </CardSubtitle>
                </CardBody>
                <CardBody>
                    <div>
                        {this.props.approval.Status === ApprovalEnum.ApprovalStatus.Waiting ? `Waiting for ` : `${this.props.approval.Status} by `}
                        <b>{this.props.approval.Assigned_x0020_To.Title} </b>
                        <MyDate date={this.props.invoice.Modified} />
                    </div>
                </CardBody>
                {
                    this.state.showMore &&
                    <CardBody style={{ wordWrap: 'break-word' }}>
                        <div>
                            Requested by <b>{this.props.approval.Author.Title} </b>
                            <MyDate date={this.props.approval.Created} />
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
                {
                    this._PromptForApproval() &&
                    <CardBody>
                        <Label>Response:</Label>
                        <textarea
                            style={{ width: '100%' }}
                            value={this.state.responseText}
                            onChange={e => { this.setState({ responseText: e.target.value }); }}
                        />
                    </CardBody>
                }
                {
                    this._PromptForApproval() &&
                    <CardActions orientation='horizontal'>
                        <div className='k-form-buttons'>
                            <PrimaryButton
                                iconProps={{ iconName: 'accept' }}
                                onClick={e => this.handleResponse('Approve')}
                                text={'Approve'}
                            />
                            <DefaultButton
                                iconProps={{ iconName: 'chromeclose' }}
                                onClick={e => this.handleResponse('Reject')}
                                text={'Reject'}
                            />
                        </div>
                    </CardActions>
                }
            </Card>
        );
    }
}
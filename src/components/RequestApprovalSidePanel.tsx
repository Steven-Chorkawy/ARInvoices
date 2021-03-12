import * as React from 'react';
import * as ReactDOM from 'react-dom';

// MS & Fluent UI
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { BaseDialog } from '@microsoft/sp-dialog';
import { IFocusTrapZoneProps, MessageBar, MessageBarType } from '@fluentui/react';

import { sp } from '@pnp/sp';


// Kendo UI
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Popup, PopupPropsContext } from '@progress/kendo-react-popup';
import { Card, CardBody } from '@progress/kendo-react-layout';

import * as MyFormComponents from './MyFormComponents';
import { ApprovalRequestTypes } from '../enums/Approvals';
import * as MyValidator from '../MyHelperMethods/Validators';
import { GetUsersByLoginName } from '../MyHelperMethods/UserProfileMethods';
import { CreateApprovalRequest } from '../MyHelperMethods/DataLayerMethods';
import { MyLists } from '../enums/MyLists';
import { PermissionKind } from '@pnp/sp/security';
import { ISiteGroupInfo } from '@pnp/sp/site-groups/types';

export interface IRequestApprovalSidePanelProps {
    isOpen?: boolean;
    panelType?: PanelType;
    invoiceId: number;
    invoiceTitle?: string;
    context?: any;
    onSubmitCallBack?: Function;
}

interface IRequestApprovalSidePanelState {
    isOpen: boolean;
    userCanEditInvoice: boolean;
    requestTypes: ApprovalRequestTypes[];
}

export default class RequestApprovalSidePanel extends React.Component<IRequestApprovalSidePanelProps, IRequestApprovalSidePanelState> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            userCanEditInvoice: true,
            requestTypes: [
                ApprovalRequestTypes["Department Approval Required"],
                ApprovalRequestTypes["Edit Required"],
                ApprovalRequestTypes["Cancel Request"]
            ]
        };

        sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(this.props.invoiceId).currentUserHasPermissions(PermissionKind.EditListItems).then(value => {
            this.setState({ userCanEditInvoice: value });
        });


        /**
         * Add extra request types ONLY if the user is not in the departments group. 
         */
        sp.web.currentUser.groups().then((value: ISiteGroupInfo[]) => {
            if (!value.some(e => e.Title.toLowerCase().includes('department'))) {
                this.setState({
                    requestTypes: [
                        ...this.state.requestTypes,
                        ApprovalRequestTypes["Accountant Approval Required"],
                        ApprovalRequestTypes["Accounting Clerk2 Approval Required"]
                    ]
                });
            }
        });
    }

    private handleSubmit = async (data) => {
        // Create the new Approval request. 
        CreateApprovalRequest(data.Approvers, this.props.invoiceId, data.Request_x0020_Type, data.Notes).then(() => {
            this.setState({ isOpen: false });
            if (this.props.onSubmitCallBack) {
                this.props.onSubmitCallBack();
            }
        });
    }

    public render(): React.ReactElement<any> {
        let wrapper = undefined;
        return (
            <Panel
                isLightDismiss={false}
                isOpen={this.state.isOpen}
                type={this.props.panelType ? this.props.panelType : PanelType.medium}
            >
                <div ref={e => wrapper = e}>
                    <PopupPropsContext.Provider value={props => ({ ...props, appendTo: wrapper })}>
                        <Form
                            initialValues={{}}
                            onSubmit={this.handleSubmit}
                            render={(formRenderProps) => (
                                <FormElement style={{ maxWidth: '1200px' }}>
                                    <fieldset className={'k-form-fieldset'}>
                                        <b><legend className={'k-form-legend'}>Request Approval {this.props.invoiceTitle && this.props.invoiceTitle}</legend></b>
                                        {
                                            !this.state.userCanEditInvoice &&
                                            <MessageBar messageBarType={MessageBarType.blocked} isMultiline={false}>
                                                You do not have the required permissions to make a request for this invoice.
                                            </MessageBar>
                                        }
                                        <Card>
                                            <CardBody>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <FieldWrapper>
                                                        <Field
                                                            id="Request_x0020_Type"
                                                            name="Request_x0020_Type"
                                                            label="Request Type"
                                                            wrapperStyle={{ width: '100%' }}
                                                            data={this.state.requestTypes}
                                                            required={true}
                                                            disabled={!this.state.userCanEditInvoice}
                                                            component={MyFormComponents.FormDropDownList}
                                                            validator={MyValidator.required}
                                                        />
                                                    </FieldWrapper>
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <FieldWrapper>
                                                        <Field
                                                            id="ApproverEmails"
                                                            name="ApproverEmails"
                                                            label="Assigned To"
                                                            wrapperStyle={{ width: '100%' }}
                                                            dataItemKey="Email"
                                                            textField="Title"
                                                            hint={'Send an approval request to one or more users.'}
                                                            validator={MyValidator.peoplePickerValidator}
                                                            personSelectionLimit={10}
                                                            context={this.props.context}
                                                            disabled={!this.state.userCanEditInvoice}
                                                            selectedItems={e => {
                                                                if (e && e.length > 0) {
                                                                    GetUsersByLoginName(e).then(res => {
                                                                        /// Settings the user IDs here so that we can save them in the List item during the form submit event. 
                                                                        formRenderProps.onChange('Approvers', { value: [...res.map(user => { return user; })] });

                                                                        // Setting this email here so it can be passed to a workflow when the form is submitted.
                                                                        // * By setting the users email here it saves us from querying this information during the forms submit event.
                                                                        formRenderProps.onChange('ApproverEmails', { value: { 'results': res.map(user => { return user.Email; }) } });
                                                                    });
                                                                }
                                                                else {
                                                                    formRenderProps.onChange('Approvers', { value: undefined });
                                                                    formRenderProps.onChange('ApproverEmails', { value: undefined });
                                                                }
                                                            }}
                                                            component={MyFormComponents.FormPeoplePicker}
                                                        />
                                                    </FieldWrapper>
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <FieldWrapper>
                                                        <Field
                                                            id="Notes"
                                                            name="Notes"
                                                            label="Notes"
                                                            wrapperStyle={{ width: '100%' }}
                                                            disabled={!this.state.userCanEditInvoice}
                                                            component={MyFormComponents.FormTextArea}
                                                        />
                                                    </FieldWrapper>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="k-form-buttons">
                                            <Button
                                                primary={true}
                                                type={'submit'}
                                                icon={'save'}
                                                disabled={!formRenderProps.allowSubmit || !this.state.userCanEditInvoice}
                                            >Submit Approval</Button>
                                            <Button icon={'cancel'} onClick={formRenderProps.onFormReset}>Clear</Button>
                                        </div>
                                    </fieldset>
                                </FormElement>
                            )}
                        />
                    </PopupPropsContext.Provider>
                </div>
            </Panel >
        );
    }
}

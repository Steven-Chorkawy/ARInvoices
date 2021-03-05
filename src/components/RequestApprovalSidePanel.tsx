import * as React from 'react';
import * as ReactDOM from 'react-dom';

// MS & Fluent UI
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { BaseDialog } from '@microsoft/sp-dialog';
import { IFocusTrapZoneProps } from '@fluentui/react';

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

export interface IRequestApprovalSidePanelProps {
    isOpen?: boolean;
    panelType?: PanelType;
    invoiceId: number;
    context?: any;
    onSubmitCallBack?: Function;
}

export default class RequestApprovalSidePanel extends React.Component<IRequestApprovalSidePanelProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };
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
                                        <b><legend className={'k-form-legend'}>Request Approval</legend></b>
                                        <Card>
                                            <CardBody>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <FieldWrapper>
                                                        <Field
                                                            id="Request_x0020_Type"
                                                            name="Request_x0020_Type"
                                                            label="Request Type"
                                                            wrapperStyle={{ width: '100%' }}
                                                            data={[
                                                                ApprovalRequestTypes["Accountant Approval Required"],
                                                                ApprovalRequestTypes["Accounting Clerk2 Approval Required"],
                                                                ApprovalRequestTypes["Cancel Request"],
                                                                ApprovalRequestTypes["Department Approval Required"],
                                                                ApprovalRequestTypes["Edit Required"]
                                                            ]}
                                                            required={true}
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
                                                disabled={!formRenderProps.allowSubmit}
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

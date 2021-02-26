import * as React from 'react';

// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { Label } from '@progress/kendo-react-labels';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { Field } from '@progress/kendo-react-form';

// My Imports
import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { PersonaComponent } from '../../../components/PersonaComponent';
import MyDate from '../../../components/MyDate';
import * as MyFormComponents from '../../../components/MyFormComponents';
import * as MyValidator from '../../../MyHelperMethods/Validators';


/**
 * This class displays data about the request. 
 */
export class RequestComponent extends React.Component<IArInvoiceSubComponentProps> {
    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Request Details</b></CardTitle>

                    <Label>Requested By:</Label>
                    <PersonaComponent userEmail={this.props.invoice.Requested_x0020_By.EMail} />

                    <Label>* Department:</Label>
                    {
                        this.props.inEditMode ?
                            <Field
                                id="Department"
                                name="Department"
                                data={this.props.editFormFieldData.departments}
                                component={MyFormComponents.FormDropDownList}
                            /> :
                            <p>{this.props.invoice.Department}</p>
                    }

                    <Label>Date:</Label>
                    {
                        this.props.inEditMode ?
                            <Field
                                id={'Date'}
                                name={'Date'}
                                component={MyFormComponents.FormDatePicker}
                                validator={MyValidator.dateValidator}
                                wrapperStyle={{ width: '50%' }}
                            /> :
                            <MyDate date={this.props.invoice.Date} />
                    }

                    <Label>Urgent:</Label>
                    {
                        this.props.inEditMode ?
                            <Field
                                id="Urgent"
                                name="Urgent"
                                label="Urgent"
                                onLabel="Yes"
                                offLabel="No"
                                wrapperStyle={{ width: '50%' }}
                                labelPlacement={'before'}
                                component={MyFormComponents.FormCheckbox}
                                hint={'Flag emails as high priority.'}
                            /> :
                            this.props.invoice.Urgent ? "Yes" : "No"
                    }

                    <Label>Note:</Label>
                    {
                        this.props.inEditMode ?
                            <Field
                                id="Details"
                                name="Details"
                                component={MyFormComponents.FormTextArea}
                            /> :
                            <p>{this.props.invoice.Details}</p>
                    }
                </CardBody>
            </Card>
        );
    }
}
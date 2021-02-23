import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';

import Moment from 'react-moment';


import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';

import { PersonaComponent } from '../../../components/PersonaComponent';
import { Editor, EditorTools } from '@progress/kendo-react-editor';

/**
 * This class displays data about the request. 
 */
export class RequestComponent extends React.Component<IArInvoiceSubComponentProps> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Request Details</b></CardTitle>
                    <Label>Requested By:</Label>
                    <PersonaComponent userEmail={this.props.invoice.Requested_x0020_By.EMail} />
                    <Label>Department:</Label>
                    <p>{this.props.invoice.Department}</p>
                    <Label>Date:</Label>
                    <p>{<Moment format="D MMM YYYY">{this.props.invoice.Date}</Moment>}</p>
                    <Label>Note:</Label>
                    <Editor
                        tools={[
                            [EditorTools.Bold, EditorTools.Italic, EditorTools.Underline],
                            [EditorTools.Link, EditorTools.Unlink],
                            [EditorTools.AlignLeft, EditorTools.AlignCenter, EditorTools.AlignRight],
                            [EditorTools.OrderedList, EditorTools.UnorderedList]
                        ]}
                        contentStyle={{ height: 320 }}
                        defaultContent={this.props.invoice.Details}
                    />
                </CardBody>
            </Card>
        );
    }
}
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { escape } from '@microsoft/sp-lodash-subset';

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import SubmitNewArInvoiceForm from '../../../webparts/submitNewArInvoiceForm/components/SubmitNewArInvoiceForm';
import { BaseDialog } from '@microsoft/sp-dialog';

export default class NewInvoiceSidePanel extends React.Component<any, any> {
    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };
    }

    public render(): React.ReactElement<any> {
        return (
            <Panel
                isLightDismiss={false}
                isOpen={this.state.isOpen}
                type={PanelType.medium}
            >
                <SubmitNewArInvoiceForm submitCallback={() => { alert('call back worked too!'); this.setState({ isOpen: false }); }} />
            </Panel>
        );
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { escape } from '@microsoft/sp-lodash-subset';

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import SubmitNewArInvoiceForm from '../../../webparts/submitNewArInvoiceForm/components/SubmitNewArInvoiceForm';
import { BaseDialog } from '@microsoft/sp-dialog';

export default class NewInvoiceSidePanel extends BaseDialog {
    public render(): void {
        ReactDOM.render(
            <Panel
                isLightDismiss={false}
                isOpen={true}
                type={PanelType.medium}
                onDismissed={() => this.close()}
            >
                <SubmitNewArInvoiceForm />
            </Panel>,
            this.domElement
        );
    }
}

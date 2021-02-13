import * as React from 'react';
import * as ReactDOM from 'react-dom';

// MS & Fluent UI
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { BaseDialog } from '@microsoft/sp-dialog';
import { IFocusTrapZoneProps } from '@fluentui/react';

// Kendo UI
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Popup, PopupPropsContext } from '@progress/kendo-react-popup';

// My Custom
import SubmitNewArInvoiceForm from '../../../webparts/submitNewArInvoiceForm/components/SubmitNewArInvoiceForm';


export interface INewInvoiceSidePanelProps {
    isOpen?: boolean;
    panelType?: PanelType;
    context: any;
}

export default class NewInvoiceSidePanel extends React.Component<INewInvoiceSidePanelProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen
        };
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
                        <SubmitNewArInvoiceForm
                            context={this.props.context}
                            submitCallback={() => { alert('call back worked too!'); this.setState({ isOpen: false }); }}
                        />
                    </PopupPropsContext.Provider>
                </div>
            </Panel >
        );
    }
}

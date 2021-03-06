import * as React from 'react';
import * as ReactDOM from 'react-dom';


import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters, RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import NewInvoiceSidePanel, { INewInvoiceSidePanelProps } from './components/NewInvoiceSidePanel';
import RequestApprovalSidePanel, { IRequestApprovalSidePanelProps } from '../../components/RequestApprovalSidePanel';

import * as strings from 'ArInvoiceListCommandSetCommandSetStrings';

import '../../MyO365.css';
import '../../bootstrap.css';
import '../../custom.css';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IArInvoiceListCommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'ArInvoiceListCommandSetCommandSet';

export default class ArInvoiceListCommandSetCommandSet extends BaseListViewCommandSet<IArInvoiceListCommandSetCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ArInvoiceListCommandSetCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    const compareCommand3: Command = this.tryGetCommand('COMMAND_3');

    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }

    if (compareCommand3) {
      compareCommand3.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {

    const selectedRow: RowAccessor = event.selectedRows[0];

    switch (event.itemId) {
      case 'COMMAND_1':
        Dialog.alert(`${this.properties.sampleTextOne}`);
        break;
      case 'COMMAND_2':
        const div = document.createElement('div');
        const element: React.ReactElement<INewInvoiceSidePanelProps> = React.createElement(
          NewInvoiceSidePanel,
          {
            isOpen: true,
            context: this.context,
            panelType: PanelType.medium
          }
        );
        ReactDOM.render(element, div);
        break;
      case "COMMAND_3":
        const command3Div = document.createElement('div');
        const command3Props: IRequestApprovalSidePanelProps = {
          invoiceId: selectedRow.getValueByName('ID'),
          invoiceTitle: selectedRow.getValueByName('Title'),
          isOpen: true,
          panelType: PanelType.medium,
          context: this.context
        };
        const command3Element: React.ReactElement<IRequestApprovalSidePanelProps> = React.createElement(
          RequestApprovalSidePanel,
          { ...command3Props }
        );
        ReactDOM.render(command3Element, command3Div);
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}

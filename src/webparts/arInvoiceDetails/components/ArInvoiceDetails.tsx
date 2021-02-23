import * as React from 'react';

// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

// My Custom Imports. 
import { MyLists } from '../../../enums/MyLists';
import * as MyFormComponents from '../../../components/MyFormComponents';
import { GetInvoiceByID } from '../../../MyHelperMethods/DataLayerMethods';
import { RequestComponent } from './RequestComponent';
import { InvoiceComponent } from './InvoiceComponent';
import { ApprovalsComponent } from './ApprovalsComponent';
import { AccountsComponent } from './AccountsComponent';
import { AttachmentsComponent } from './AttachmentsComponent';
import { AllComponents } from './AllComponents';

import { IARInvoice } from '../../../interfaces/IARInvoice';

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';
import { Button } from '@progress/kendo-react-buttons';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';



export interface IArInvoiceDetailsProps {
  description: string;
  context: any;
}

export interface IArInvoiceDetailsState {
  invoices?: any;       // The invoice that should be displayed in the combo box. 
  allInvoices?: any;    // All of the invoices regardless of filter applied. 
  invoiceID?: number;
  currentInvoice?: IARInvoice;
  selectedTab: number;
}

/**
 * This invoice is to be used by this components children. 
 */
export interface IArInvoiceSubComponentProps {
  invoice: IARInvoice;
  context?: any;
}

enum ARInvoiceQueryParams {
  ARInvoiceId = 'ariid', // ariid = AR Invoice Id
}

export default class ArInvoiceDetails extends React.Component<IArInvoiceDetailsProps, IArInvoiceDetailsState> {

  constructor(props) {
    super(props);
    let idFromQueryParam: string = this.getInvoiceIDFromQueryParams();

    this.state = {
      invoiceID: idFromQueryParam ? Number(idFromQueryParam) : undefined,
      invoices: undefined,
      allInvoices: undefined,
      currentInvoice: undefined,
      selectedTab: 0
    };

    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.select('ID, Title, Status').getAll().then(invoices => {
      this.setState({
        invoices: invoices,
        allInvoices: invoices
      });
    });

    if (idFromQueryParam) {
      GetInvoiceByID(Number(idFromQueryParam)).then(invoice => {
        this.setState({ currentInvoice: invoice });
      });
    }
  }

  private getInvoiceIDFromQueryParams = () => {
    return new UrlQueryParameterCollection(window.location.href).getValue(ARInvoiceQueryParams.ARInvoiceId);
  }

  //#region ComboBox Methods.
  private filterComboBox = e => {
    const data = this.state.allInvoices.slice();
    this.setState({ invoices: filterBy(data, e.filter) });
  }

  private onChangeComboBox = e => {
    if (e && e.value) {
      GetInvoiceByID(e.value.ID).then(invoice => {
        this.setState({
          currentInvoice: invoice,
          invoices: this.state.allInvoices
        });
      });
    }
    else {
      this.setState({
        currentInvoice: undefined,
        invoices: this.state.allInvoices
      });
    }
  }

  private comboBoxItemRender = (li, itemProps) => {
    const dataItem = itemProps.dataItem;
    const itemChildren =
      <div>
        <span title={'Status'}>{dataItem.Status}</span> | <span title={'Title'}>{dataItem.Title}</span>
      </div>;
    return React.cloneElement(li, li.props, itemChildren);
  }
  //#endregion

  public render(): React.ReactElement<IArInvoiceDetailsProps> {
    return (
      <div>
        <ComboBox
          data={this.state.invoices}
          textField={'Title'}
          dataItemKey={'ID'}
          loading={this.state.invoices === undefined}
          style={{ width: '100%' }}
          value={this.state.currentInvoice}
          filterable={true}
          onFilterChange={this.filterComboBox}
          onChange={this.onChangeComboBox}
          itemRender={this.comboBoxItemRender}
        />
        <hr />
        {
          this.state.currentInvoice ?
            <Form
              initialValues={{ ...this.state.currentInvoice }}
              onSubmit={e => console.log(e)}
              render={formRenderProps => (
                <FormElement style={{ maxWidth: '1200px', marginRight: 'auto', marginLeft: 'auto' }}>
                  <div className="k-form-buttons">
                    <Button
                      primary={true}
                      type={'submit'}
                      icon={'save'}
                      disabled={!formRenderProps.allowSubmit}
                    >Save AR Invoice</Button>
                    <Button icon={'cancel'} onClick={formRenderProps.onFormReset}>Clear</Button>
                  </div>
                  <TabStrip key={this.state.currentInvoice.ID} selected={this.state.selectedTab} onSelect={e => this.setState({ selectedTab: e.selected })} style={{ width: '100%' }}>
                    <TabStripTab title={'All'}>
                      <AllComponents invoice={this.state.currentInvoice} />
                    </TabStripTab>
                    <TabStripTab title={'Request Details'}>
                      <RequestComponent invoice={this.state.currentInvoice} />
                    </TabStripTab>
                    <TabStripTab title={'Invoice Details'}>
                      <InvoiceComponent invoice={this.state.currentInvoice} />
                    </TabStripTab>
                    <TabStripTab title={'Approvals'}>
                      <ApprovalsComponent invoice={this.state.currentInvoice} />
                    </TabStripTab>
                    <TabStripTab title={'Accounts'}>
                      <AccountsComponent invoice={this.state.currentInvoice} />
                    </TabStripTab>
                    <TabStripTab title={'Attachments'}>
                      <AttachmentsComponent invoice={this.state.currentInvoice} />
                    </TabStripTab>
                  </TabStrip>
                  <div className="k-form-buttons">
                    <Button
                      primary={true}
                      type={'submit'}
                      icon={'save'}
                      disabled={!formRenderProps.allowSubmit}
                    >Save AR Invoice</Button>
                    <Button icon={'cancel'} onClick={formRenderProps.onFormReset}>Clear</Button>
                  </div>
                </FormElement>
              )}
            /> :
            <div>
              <h3>No Invoice Selected.</h3>
            </div>
        }
      </div>
    );
  }
}

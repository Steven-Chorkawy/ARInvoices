import * as React from 'react';

// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

// My Custom Imports. 
import { MyLists } from '../../../enums/MyLists';

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';

export interface IArInvoiceDetailsProps {
  description: string;
}

export interface IArInvoiceDetailsState {
  invoices?: any;
  invoiceID?: number;
  currentInvoice?: any;
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
      currentInvoice: undefined
    };

    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.select('ID, Title, Status').getAll().then(invoices => {
      this.setState({ invoices: invoices });
    });

    if (idFromQueryParam) {
      this.getInvoiceById(Number(idFromQueryParam)).then(invoice => {
        this.setState({ currentInvoice: invoice });
      });
    }
  }

  private getInvoiceIDFromQueryParams = () => {
    return new UrlQueryParameterCollection(window.location.href).getValue(ARInvoiceQueryParams.ARInvoiceId);
  }

  private getInvoiceById = async (id) => {
    return await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(id).get();
  }

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
          clearButton={false}
          onChange={e => {
            if (e) {
              this.getInvoiceById(e.value.ID).then(invoice => {
                this.setState({ currentInvoice: invoice });
              });
            }
          }}
        />
        {
          this.state.invoiceID &&
          <div>
            ID: {this.state.invoiceID}
          </div>
        }
        {
          this.state.invoices &&
          <div>
            Invoices Found: {this.state.invoices.length}
          </div>
        }
        {
          this.state.currentInvoice &&
          <div>Current Invoice: {this.state.currentInvoice.Title}</div>
        }
      </div>
    );
  }
}

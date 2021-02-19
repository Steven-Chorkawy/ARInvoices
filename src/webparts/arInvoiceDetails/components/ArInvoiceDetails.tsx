import * as React from 'react';

// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

// My Custom Imports. 
import { MyLists } from '../../../enums/MyLists';

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
      sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(Number(idFromQueryParam)).get().then(invoice => {
        this.setState({ currentInvoice: invoice });
      });
    }
  }

  private getInvoiceIDFromQueryParams = () => {
    return new UrlQueryParameterCollection(window.location.href).getValue(ARInvoiceQueryParams.ARInvoiceId);
  }

  public render(): React.ReactElement<IArInvoiceDetailsProps> {
    return (
      <div>
        <h1>hello world</h1>
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

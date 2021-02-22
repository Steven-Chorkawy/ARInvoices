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


// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';
import { Button } from '@progress/kendo-react-buttons';


export interface IArInvoiceDetailsProps {
  description: string;
  context: any;
}

export interface IArInvoiceDetailsState {
  invoices?: any;       // The invoice that should be displayed in the combo box. 
  allInvoices?: any;    // All of the invoices regardless of filter applied. 
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
      allInvoices: undefined,
      currentInvoice: undefined
    };

    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.select('ID, Title, Status').getAll().then(invoices => {
      this.setState({
        invoices: invoices,
        allInvoices: invoices
      });
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

  //#region ComboBox Methods.
  private filterComboBox = e => {
    const data = this.state.allInvoices.slice();
    this.setState({ invoices: filterBy(data, e.filter) });
  }

  private onChangeComboBox = e => {
    if (e && e.value) {
      this.getInvoiceById(e.value.ID).then(invoice => {
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
        <Label>Search Invoices:</Label>
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
                <FormElement style={{ maxWidth: '1200px', marginRight: 'auto', marginLeft: 'auto', padding: '15px' }}>
                  <FieldWrapper>
                    <Field
                      id="Requested_x0020_By"
                      name="Requested_x0020_By"
                      label="Requested By"
                      wrapperStyle={{ width: '100%' }}
                      context={this.props.context}
                      userEmail={this.props.context.pageContext.user.email}
                      component={MyFormComponents.FormPersonaDisplay}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    {/* <Field
                    id={'Date'}
                    name={'Date'}
                    label={'* Date'}
                    component={MyFormComponents.FormDatePicker}
                    //validator={MyValidator.dateValidator}
                    wrapperStyle={{ width: '50%' }}
                  /> */}
                  </FieldWrapper>
                  <div className="k-form-buttons">
                    <Button
                      primary={true}
                      type={'submit'}
                      icon={'save'}
                      disabled={!formRenderProps.allowSubmit}
                    >Submit AR Invoice</Button>
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

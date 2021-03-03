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
import { GetInvoiceByID, UpdateARInvoice, DeleteARInvoiceAccounts, UpdateARInvoiceAccounts, UpdateApprovalRequest } from '../../../MyHelperMethods/DataLayerMethods';
import { RequestComponent } from './RequestComponent';
import { CustomerComponent } from './CustomerComponent';
import { ApprovalsComponent } from './ApprovalsComponent';
import { AccountsComponent } from './AccountsComponent';
import { AttachmentsComponent } from './AttachmentsComponent';
import { AllComponents } from './AllComponents';
import { IARInvoice } from '../../../interfaces/IARInvoice';

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper, FormRenderProps } from '@progress/kendo-react-form';

// Fluent UI
import { DefaultButton, PrimaryButton, Pivot, PivotItem } from 'office-ui-fabric-react';
import { GetChoiceFieldValues, BuildGUID } from '../../../MyHelperMethods/HelperMethods';
import { ApprovalRequestTypes, ApprovalStatus } from '../../../enums/Approvals';

export interface IArInvoiceDetailsProps {
  description: string;
  context: any;
}

// Hold the data that is used to populate dropdowns, etc, in the edit form. 
interface IARInvoiceEditFormFieldData {
  departments: any[];
}

export interface IArInvoiceDetailsState {
  invoices?: any;       // The invoice that should be displayed in the combo box. 
  allInvoices?: any;    // All of the invoices regardless of filter applied. 
  invoiceID?: number;
  currentInvoice?: IARInvoice;
  selectedTab: number;
  inEditMode: boolean;
  editFormFieldData?: IARInvoiceEditFormFieldData;
}

/**
 * This invoice is to be used by this components children. 
 */
export interface IArInvoiceSubComponentProps {
  invoice: IARInvoice;
  context?: any;
  inEditMode: boolean;
  editFormFieldData: IARInvoiceEditFormFieldData;
  formRenderProps: FormRenderProps;
}

enum ARInvoiceQueryParams {
  ARInvoiceId = 'ariid', // ariid = AR Invoice Id
}

export class ArInvoiceDetails extends React.Component<IArInvoiceDetailsProps, IArInvoiceDetailsState> {

  constructor(props) {
    super(props);

    let idFromQueryParam: string = this.getInvoiceIDFromQueryParams();

    this.state = {
      invoiceID: idFromQueryParam ? Number(idFromQueryParam) : undefined,
      invoices: undefined,
      allInvoices: undefined,
      currentInvoice: undefined,
      selectedTab: 0,
      inEditMode: false
    };

    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.select('ID, Title, Status').getAll().then(invoices => {
      this.setState({
        invoices: invoices,
        allInvoices: invoices
      });
    });

    GetChoiceFieldValues(MyLists["AR Invoice Requests"], 'Department').then(values => {
      this.setState({ editFormFieldData: { departments: values } });
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

  //#region Account CRUD Methods
  private account_onDelete = e => {
    DeleteARInvoiceAccounts(e);
  }

  private account_onSave = e => {
    UpdateARInvoiceAccounts(e);
  }
  //#endregion

  //#region Approval CRUD Methods
  private _handleApprovalResponse = async (approvalId: number, responseStatus: string | ApprovalStatus, responseMessage: string) => {
    let response = await UpdateApprovalRequest(approvalId, responseStatus, responseMessage);
    if (response !== undefined) {
      GetInvoiceByID(this.state.currentInvoice.ID).then(invoice => {
        this.setState({ currentInvoice: invoice });
      });
    }
  }
  //#endregion

  private _buttons = (formRenderProps) => {
    return (
      <div className="k-form-buttons">
        <PrimaryButton iconProps={{ iconName: 'save' }} type={'submit'} disabled={!formRenderProps.touched}>Save</PrimaryButton>
        <PrimaryButton iconProps={{ iconName: 'edit' }} onClick={() => { this.setState({ inEditMode: true }); }} disabled={this.state.inEditMode}>Edit</PrimaryButton>
        <DefaultButton onClick={() => { formRenderProps.onFormReset(); this.setState({ inEditMode: false }); }}>Reset</DefaultButton>
      </div>
    );
  }

  public render(): React.ReactElement<IArInvoiceDetailsProps> {
    const subComponentProps = {
      invoice: this.state.currentInvoice,
      inEditMode: this.state.inEditMode,
      editFormFieldData: { ...this.state.editFormFieldData },
    };

    return (
      <div key={this.state.currentInvoice ? `${this.state.currentInvoice.ID}-${this.state.currentInvoice.Modified}` : 0} style={{ maxWidth: '1200px', marginRight: 'auto', marginLeft: 'auto' }}>
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
              initialValues={{
                ...this.state.currentInvoice,
              }}
              onSubmit={e => {
                UpdateARInvoice(e).then(() => {
                  GetInvoiceByID(this.state.currentInvoice.ID).then(invoice => {
                    this.setState({ currentInvoice: invoice, inEditMode: false });
                  });
                });
              }}
              render={formRenderProps => (
                <FormElement >
                  {this._buttons(formRenderProps)}
                  <Pivot style={{ width: '100%' }}>
                    <PivotItem title={'All'} headerText={'All'}>
                      <AllComponents
                        {...subComponentProps}
                        formRenderProps={formRenderProps}
                        AccountCRUD={{
                          onDelete: this.account_onDelete,
                          onSave: this.account_onSave,
                        }}
                        handleApprovalResponse={this._handleApprovalResponse}
                      />
                    </PivotItem>
                    <PivotItem title={'Request Details'} headerText={'Request Details'}>
                      <RequestComponent {...subComponentProps} formRenderProps={formRenderProps} />
                    </PivotItem>
                    <PivotItem title={'Customer Details'} headerText={'Customer Details'}>
                      <CustomerComponent {...subComponentProps} formRenderProps={formRenderProps} />
                    </PivotItem>
                    <PivotItem title={'Approvals'} headerText={'Approvals'}>
                      <ApprovalsComponent
                        {...subComponentProps}
                        formRenderProps={formRenderProps}
                        handleApprovalResponse={this._handleApprovalResponse}
                      />
                    </PivotItem>
                    <PivotItem title={'Accounts'} headerText={'Accounts'}>
                      <AccountsComponent
                        {...subComponentProps}
                        formRenderProps={formRenderProps}
                        onDelete={this.account_onDelete}
                      />
                    </PivotItem>
                    <PivotItem title={'Attachments'} headerText={'Attachments'}>
                      <AttachmentsComponent {...subComponentProps} formRenderProps={formRenderProps} />
                    </PivotItem>
                  </Pivot>
                  {this._buttons(formRenderProps)}
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

//#region Imports
import * as React from 'react';

// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Office UI
import { TextField } from 'office-ui-fabric-react/lib/TextField';

// Kendo UI
import { Form, Field, FormElement, FieldWrapper, FieldArray } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { filterBy } from '@progress/kendo-data-query';

// My Custom Imports
import { GetUserProfileProperties, GetUsersByLoginName, GetUserByLoginName } from '../../../MyHelperMethods/UserProfileMethods';
import { MyLists } from '../../../enums/MyLists';
import * as MyFormComponents from '../../../components/MyFormComponents';
import { GetChoiceFieldValues } from '../../../MyHelperMethods/HelperMethods';
import { CreateARInvoice } from '../../../MyHelperMethods/DataLayerMethods';
import * as MyValidator from '../../../MyHelperMethods/Validators';
//#endregion

//#region Interface
export interface ISubmitNewArInvoiceFormProps {
  description?: string;
  context: any;
  submitCallback?: any;
}

export interface ISubmitNewArInvoiceFormState {
  departments?: any[];
  standardTerms?: any[];
  // These are the customer records that have been filtered and that we want to display to the users.
  displayCustomerList?: any[]; // This is an array of list items from the Customers list. 

  // These are ALL the customers that we've queried from SharePoint. 
  allCustomerList?: any[];

  // Determines if the Misc Customer fields should be rendered or not. 
  // TRUE = Show Drop Down/ Combo Box. 
  // FALSE = Show Misc Customer fields. 
  showCustomerDropDown: boolean;

  currentUser?: any;
}
//#endregion

export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, ISubmitNewArInvoiceFormState> {
  constructor(props) {
    super(props);

    this.state = {
      departments: undefined,
      standardTerms: undefined,
      displayCustomerList: undefined,
      currentUser: undefined,
      showCustomerDropDown: true
    };

    sp.web.currentUser.get().then(user => {
      GetUserProfileProperties(
        user.LoginName,
        values => this.setState({ currentUser: values },
          () => {
            // Making this second call just to get the users ID. 
            GetUserByLoginName(user.LoginName).then(value => {
              this.setState({ currentUser: { ...this.state.currentUser, Id: value.Id } });
            });
          })
      );
    });

    GetChoiceFieldValues(MyLists["AR Invoice Requests"], 'Department').then(values => {
      this.setState({ departments: values });
    });

    GetChoiceFieldValues(MyLists['AR Invoice Requests'], 'Standard_x0020_Terms').then(values => {
      this.setState({ standardTerms: values });
    });

    sp.web.lists.getByTitle(MyLists.Customers).items.getAll().then(values => {
      this.setState({
        allCustomerList: values,
        displayCustomerList: values
      });
    });
  }

  //#region Customer Field Methods
  /**
     * Render each customer item.
     * @param li List Item Element
     * @param itemProps List Item Props
     */
  private customerItemRender = (li, itemProps) => {
    return React.cloneElement(li, li.props, <span>{itemProps.dataItem.Title} | {itemProps.dataItem.WorkAddress}</span>);
  }

  private customerFilterChange = e => {
    setTimeout(() => {
      this.setState({
        displayCustomerList: filterBy(this.state.allCustomerList.slice(), e.filter)
      });
    }, 500);
  }
  //#endregion

  public render(): React.ReactElement<ISubmitNewArInvoiceFormProps> {

    const handleSubmit = (dataItem) => {
      CreateARInvoice(dataItem).then(value => {
        alert('After CreateARInvoice method...');
        console.log('Before handleSubmit callback: ');
        console.log(value);

        this.props.submitCallback && this.props.submitCallback();
      });
    };

    return (
      <div>
        {
          this.state.currentUser &&
          <Form
            initialValues={{
              Invoice: {
                Date: new Date(),
                Urgent: false,
                Standard_x0020_Terms: 'NET 30, 1% INTEREST CHARGED',
                Department: this.state.currentUser && this.state.currentUser.Props['SPS-Department'],
                Requested_x0020_ById: this.state.currentUser && this.state.currentUser.Email

              }
            }}
            onSubmit={handleSubmit}
            render={(formRenderProps) => (
              <FormElement style={{ maxWidth: '1200px', marginRight: 'auto', marginLeft: 'auto', padding: '15px' }}>
                <fieldset className={'k-form-fieldset'}>
                  <b><legend className={'k-form-legend'}>Create New AR Invoice</legend></b>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FieldWrapper>
                      <Field
                        id="Requested_x0020_By"
                        name="Invoice.Requested_x0020_By"
                        label="Requested By"
                        wrapperStyle={{ width: '100%' }}
                        context={this.props.context}
                        userEmail={this.props.context.pageContext.user.email}
                        component={MyFormComponents.FormPersonaDisplay}
                      />
                    </FieldWrapper>
                    <Field
                      id={'Date'}
                      name={'Invoice.Date'}
                      label={'* Date'}
                      component={MyFormComponents.FormDatePicker}
                      validator={MyValidator.dateValidator}
                      wrapperStyle={{ width: '50%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '50%' }}>
                      <Field
                        id="Department"
                        name="Invoice.Department"
                        label="* Department"
                        wrapperStyle={{ width: '90%' }}
                        data={this.state.departments ? this.state.departments : []}
                        //validator={MyValidators.departmentValidator}
                        component={MyFormComponents.FormDropDownList}
                      />
                    </div>
                    <div style={{ width: '50%' }}>
                      <Field
                        id="Urgent"
                        name="Invoice.Urgent"
                        label="Urgent"
                        onLabel="Yes"
                        offLabel="No"
                        wrapperStyle={{ width: '50%' }}
                        labelPlacement={'before'}
                        component={MyFormComponents.FormCheckbox}
                        hint={'Flag emails as high priority.'}
                      />
                    </div>
                  </div>

                  <FieldWrapper>
                    <Field
                      id="ApproverEmails"
                      name="ApproverEmails"
                      label="* Requires Authorization By"
                      wrapperStyle={{ width: '100%' }}
                      dataItemKey="Email"
                      textField="Title"
                      hint={'Send an approval request to one or more users.'}
                      validator={MyValidator.peoplePickerValidator}
                      personSelectionLimit={10}
                      context={this.props.context}
                      selectedItems={e => {
                        if (e && e.length > 0) {
                          GetUsersByLoginName(e).then(res => {
                            /// Settings the user IDs here so that we can save them in the List item during the form submit event. 
                            // formRenderProps.onChange('Requires_x0020_Department_x0020_Id', {
                            //   value: { 'results': res.map(user => { return user.Id; }) }
                            // });

                            // Setting this email here so it can be passed to a workflow when the form is submitted.
                            // * By setting the users email here it saves us from querying this information during the forms submit event.  
                            formRenderProps.onChange('ApproverEmails', { value: { 'results': res.map(user => { return user.Email; }) } });
                          });
                        }
                        else {
                          formRenderProps.onChange('ApproverEmails', { value: undefined });
                        }
                      }}
                      component={MyFormComponents.FormPeoplePicker}
                    />
                  </FieldWrapper>

                  {
                    this.state.showCustomerDropDown ?
                      <FieldWrapper>
                        <Field
                          id="Customer"
                          name="Customer"
                          label="* Customer"
                          wrapperStyle={{ width: '100%' }}
                          data={this.state.displayCustomerList}
                          dataItemKey="Id"
                          textField="Title"
                          validator={MyValidator.requiresCustomer}
                          allowCustom={false}
                          itemRender={this.customerItemRender}
                          component={MyFormComponents.FormComboBox}
                          filterable={true}
                          suggest={true}
                          onFilterChange={this.customerFilterChange}
                        />
                      </FieldWrapper> :
                      <div>
                        <FieldWrapper>
                          <Field
                            id="Customer_x0020_Name"
                            name="Invoice.Customer_x0020_Name"
                            label="* Customer Name"
                            validator={MyValidator.requireCustomerName}
                            component={MyFormComponents.FormInput}
                          />
                        </FieldWrapper>
                        <FieldWrapper>
                          <Field
                            id="Customer_x0020_Details"
                            name="Invoice.Customer_x0020_Details"
                            label="Customer Details"
                            component={MyFormComponents.FormTextArea}
                          />
                        </FieldWrapper>
                      </div>
                  }
                  <p onClick={e => {
                    e.preventDefault();
                    this.setState({ showCustomerDropDown: !this.state.showCustomerDropDown },
                      () => {
                        if (this.state.showCustomerDropDown) {
                          // Remove Customer Name and Details field. 
                          formRenderProps.onChange('Invoice.Customer_x0020_Name', { value: undefined });
                          formRenderProps.onChange('Invoice.Customer_x0020_Details', { value: undefined });
                        }
                        else {
                          // Remove the Customer field. 
                          formRenderProps.onChange('Customer', { value: undefined });
                        }
                      });
                  }}>Click to {this.state.showCustomerDropDown ? 'manually enter customer details.' : 'search for customers.'}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Field
                      id="Customer_x0020_PO_x0020_Number"
                      name="Invoice.Customer_x0020_PO_x0020_Number"
                      label="Customer PO Number"
                      component={MyFormComponents.FormInput}
                    />

                    <Field
                      id="Standard_x0020_Terms"
                      name="Invoice.Standard_x0020_Terms"
                      label="Standard Terms"
                      wrapperStyle={{ width: '50%' }}
                      data={
                        this.state.standardTerms
                          ? this.state.standardTerms
                          : []
                      }
                      component={MyFormComponents.FormDropDownList}
                    />
                  </div>

                  <FieldWrapper>
                    <Field
                      id="Details"
                      name="Invoice.Details"
                      label="Invoice Details"
                      component={MyFormComponents.FormTextArea}
                    />
                  </FieldWrapper>
                  <FieldWrapper>
                    <FieldArray name='AccountCodes' label='Account Codes' component={MyFormComponents.FormAccountListView} />
                  </FieldWrapper>
                  <FieldWrapper>
                    <Field id='Attachments' name='Attachments' label='Attachments' component={MyFormComponents.FormUpload} />
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
                </fieldset>
              </FormElement>
            )}
          />
        }
      </div>
    );
  }
}

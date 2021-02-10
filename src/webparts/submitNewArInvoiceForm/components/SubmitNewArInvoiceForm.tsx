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
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { filterBy } from '@progress/kendo-data-query';

// My Custom Imports
import { GetUsersByLoginName } from '../../../MyHelperMethods/UserProfileMethods';
import { MyLists } from '../../../enums/MyLists';
import * as MyFormComponents from '../../../components/MyFormComponents';
import { GetChoiceFieldValues } from '../../../MyHelperMethods/HelperMethods';
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
}
//#endregion

export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, ISubmitNewArInvoiceFormState> {
  constructor(props) {
    super(props);

    this.state = {
      departments: undefined,
      standardTerms: undefined,
      displayCustomerList: undefined
    };

    GetChoiceFieldValues(MyLists["AR Invoice Requests"], 'Department').then(values => {
      this.setState({ departments: values });
    });

    GetChoiceFieldValues(MyLists['AR Invoice Requests'], 'Standard_x0020_Terms').then(values => {
      this.setState({ standardTerms: values });
    });

    sp.web.lists.getByTitle(MyLists.Customers).items.getAll().then(values => {
      debugger;
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
      alert(JSON.stringify(dataItem, null, 2));
      sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(dataItem).then(value => {
        alert('It worked!');
        this.props.submitCallback && this.props.submitCallback();
      });
    };

    return (
      <Form
        initialValues={{
          Date: new Date(),
          Urgent: false,
          Standard_x0020_Terms: 'NET 30, 1% INTEREST CHARGED',
          // GLAccounts: [],
          // Department: this.state.currentUser && this.state.currentUser.Props['SPS-Department'],     
        }}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 1200 }}>
            <fieldset className={'k-form-fieldset'}>
              <b><legend className={'k-form-legend'}>Create New AR Invoice</legend></b>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                <Field
                  id={'Date'}
                  name={'Date'}
                  label={'* Date'}
                  component={MyFormComponents.FormDatePicker}
                  //validator={MyValidators.dateValidator}
                  wrapperStyle={{ width: '50%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Field
                  id="Department"
                  name="Department"
                  label="* Department"
                  wrapperStyle={{ width: '45%' }}
                  data={this.state.departments ? this.state.departments : []}
                  //validator={MyValidators.departmentValidator}
                  component={MyFormComponents.FormDropDownList}
                />
                <Field
                  id="Urgent"
                  name="Urgent"
                  label="Urgent"
                  onLabel="Yes"
                  offLabel="No"
                  wrapperStyle={{ width: '50%' }}
                  labelPlacement={'before'}
                  component={MyFormComponents.FormCheckbox}
                  hint={'Flag emails as high priority.'}
                />
              </div>

              <FieldWrapper>
                <Field
                  id="Requires_x0020_Department_x0020_Id"
                  name="Requires_x0020_Department_x0020_Id"
                  label="* Requires Authorization By"
                  wrapperStyle={{ width: '100%' }}
                  dataItemKey="Email"
                  textField="Title"
                  hint={'Send an approval request to one or more users.'}
                  //validator={MyValidators.requireOneOrMorePeople}
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
                        formRenderProps.onChange('Requires_x0020_Authorization_x0020_ByEmail', {
                          value: { 'results': res.map(user => { return user.Email; }) }
                        });
                      });
                    }
                  }}
                  component={MyFormComponents.FormPeoplePicker}
                />
              </FieldWrapper>

              <FieldWrapper>
                <Field
                  id="Customer"
                  name="Customer"
                  label="* Customer"
                  wrapperStyle={{ width: '100%' }}
                  data={this.state.displayCustomerList}
                  dataItemKey="Id"
                  textField="Title"
                  //validator={MyValidators.requiresCustomer}
                  allowCustom={true}
                  itemRender={this.customerItemRender}
                  component={MyFormComponents.FormComboBox}
                  filterable={true}
                  suggest={true}
                  onFilterChange={this.customerFilterChange}
                />
                {/* {
                  this._ShowCustomerDetails(formRenderProps.valueGetter('Customer')) &&
                  <Field
                    id={'MiscCustomerDetails'}
                    name={'MiscCustomerDetails'}
                    label={'Enter Additional Customer Details'}
                    placeholder={'Address, Postal Code, Contact, etc....'}
                    component={MyFormComponents.FormTextArea}
                  />
                } */}
              </FieldWrapper>

              <div className="k-form-buttons">
                <Button
                  primary={true}
                  type={'submit'}
                  disabled={!formRenderProps.allowSubmit}
                >Submit AR Invoice</Button>
                <Button onClick={formRenderProps.onFormReset}>Clear</Button>
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    );
  }
}

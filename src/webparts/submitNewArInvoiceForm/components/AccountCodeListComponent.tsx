import * as React from 'react';

import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { Card, CardTitle, CardSubtitle, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox, MaskedTextBox, NumericTextBox } from '@progress/kendo-react-inputs';

import { IAccount } from '../../../interfaces/IAccount';
import { Field } from '@progress/kendo-react-form';
import { Fields } from '@pnp/sp/fields';

//#region Interfaces
interface IAccountCodeItemProps {
    dataItem: IAccount;
    index: number;
    field: string;
}

interface IAccountCodeItemState {
    item: IAccount;
}
//#endregion

//#region Component Methods
const MyHeader = (props) => {
    return (
        <ListViewHeader style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
            <Button
                look='flat'
                icon='plus'
                primary={true}
                onClick={e => {
                    e.preventDefault();
                    props.onAdd();
                }}
            >Add New Account</Button>
        </ListViewHeader>
    );
};
//#endregion

class AccountCodeItem extends React.Component<IAccountCodeItemProps, IAccountCodeItemState> {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.dataItem
        };
    }

    public handleChange = (e, field) => {
        let updatedItem = { ...this.state.item };
        updatedItem[field] = e.value;
        this.setState({ item: updatedItem });
    }

    /**
     * If HST_x0020_Taxable is TRUE:    return e.item.Amount * 0.13
     * If HST_x0020_Taxable is FALSE:   return 0
     */
    private _calculateHSTAmount = e => {
        return (e.item.HST_x0020_Taxable === true) ? e.item.Amount * 0.13 : 0;
    }

    public render() {
        return (
            <Card>
                <CardBody>
                    <div className={'row'}>
                        <div className={'col-md-10'}>
                            <div className={'row'}>
                                <div className={'col-md-6'}>
                                    <label style={{ display: 'block' }}>Account Code:</label>
                                    <Field
                                        name={`AccountCodes[${this.props.index}].Account_x0020_Code`}
                                        component={MaskedTextBox}
                                        mask="000-00-000-00000-0000"
                                        required={true}
                                    />
                                </div>
                                <div className={'col-md-6'}>
                                    <label style={{ display: 'block' }}>Amount:</label>
                                    <Field
                                        name={`AccountCodes[${this.props.index}].Amount`}
                                        component={NumericTextBox}
                                        required={true}
                                        format="c2"
                                        min={0}
                                    />
                                </div>
                            </div>
                            <div className={'row'} style={{ paddingTop: '5px' }}>
                                <div className={'col-md-6 col-sm-6'}>
                                    <div className={'col-md-4 col-sm-3'}>
                                        <label style={{ display: 'block' }}>HST:</label>
                                        <Field
                                            name={`AccountCodes[${this.props.index}].HST_x0020_Taxable`}
                                            component={Checkbox}
                                        />
                                    </div>
                                    <div className={'col-md-8 col-sm-3'}>
                                        <label style={{ display: 'block' }}>HST Amount:</label>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) : 0)}
                                    </div>
                                </div>
                                <div className={'col-md-6 col-sm-6'}>
                                    <label style={{ display: 'block' }}>Total:</label>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) + this.state.item.Amount : 0)}
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-2'}>
                            {/* <Button primary={true} look={'flat'} disabled={this._disableSaveButton()} title={'Save'} icon={'save'} style={{ marginRight: 5 }} onClick={this.handleSave}></Button>
                            {
                                this.state.item.ID
                                    ?
                                    <Button icon={'cancel'} look={'flat'} title={'Cancel'} onClick={this.cancelEdit}></Button>
                                    :
                                    <Button icon={'delete'} look={'flat'} title={'Delete'} onClick={this.handleDelete}></Button>
                            } */}
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export class AccountCodeListComponent extends React.Component<any, any> {

    //AccountCodeItem = props => <AccountCodeItem {...props} saveItem={this.saveData} deleteItem={this.deleteItem} />
    public AccountCodeItem = props => <AccountCodeItem {...props} />;

    public render() {
        return (
            <ListView
                data={this.props.data}
                item={this.AccountCodeItem}
                // style={{ width: "100%", height: 500 }}
                header={() => MyHeader(this.props)}
            />
        );
    }
}

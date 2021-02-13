import * as React from 'react';

import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { Card, CardTitle, CardSubtitle, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox, MaskedTextBox, NumericTextBox } from '@progress/kendo-react-inputs';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';

import { IAccount } from '../../../interfaces/IAccount';
import { Field } from '@progress/kendo-react-form';
import { Fields } from '@pnp/sp/fields';

//#region Interfaces
interface IAccountCodeListComponent {
    data: any;
    onAdd?: Function;
    onRemove?: Function;
}

interface IAccountCodeItemProps extends IAccountCodeListComponent {
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
        debugger;

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
                        <div className={'col-md-10'} style={{ paddingRight: '0px' }}>
                            <div className={'row'}>
                                <div className={'col-md-5'}>
                                    <Label style={{ display: 'block' }}>Account Code:  </Label>
                                    <Field
                                        name={`AccountCodes[${this.props.index}].Account_x0020_Code`}
                                        component={MaskedTextBox}
                                        mask="000-00-000-00000-0000"
                                        required={true}
                                    />
                                </div>
                                <div className={'col-md-5'}>
                                    <Label style={{ display: 'block' }}>Apply HST:  </Label>
                                    <Field
                                        name={`AccountCodes[${this.props.index}].HST_x0020_Taxable`}
                                        component={Checkbox}
                                    />
                                </div>

                            </div>
                            <div className={'row'}>
                                <div className={'col-md-5'}>
                                    <Label style={{ display: 'block' }}>Amount:  </Label>
                                    <Field
                                        name={`AccountCodes[${this.props.index}].Amount`}
                                        component={NumericTextBox}
                                        required={true}
                                        format="c2"
                                        min={0}
                                    />
                                    <Hint>HST Amount: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) : 0)}</Hint>
                                </div>
                                <div className={'col-md-5'}>
                                    <Label style={{ display: 'block' }}>Total:  </Label>
                                    <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) + this.state.item.Amount : 0)}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'col-md-1'} style={{ paddingRight: '0px' }}>
                            <Button primary={true} look={'flat'} title={'Save'} icon={'save'} onClick={e => { e.preventDefault(); }} />
                            <Button icon={'cancel'} look={'flat'} title={'Cancel'} onClick={e => { e.preventDefault(); }} />
                            <Button icon={'delete'} look={'flat'} title={'Delete'} onClick={e => { e.preventDefault(); }} />
                            <Button icon={'close'} look={'flat'} title={'remove'} onClick={e => { e.preventDefault(); }} />
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}


export class AccountCodeListComponent extends React.Component<IAccountCodeListComponent, any> {
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

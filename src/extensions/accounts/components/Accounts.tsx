import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './Accounts.module.scss';
import { IAccount } from '../../../interfaces/IARInvoice';
import AccountsHoverCard from './AccountsHoverCard';

const LOG_SOURCE: string = 'Accounts';

interface IAccountsFieldProps {
  accounts: IAccount[];
}

export default class Accounts extends React.Component<IAccountsFieldProps, any> {
  

  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: Accounts mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: Accounts unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    return (
      // <div className={styles.cell}>
      this.props.accounts ? <AccountsHoverCard accounts={this.props.accounts} /> : null
      // </div>
    );
  }
}

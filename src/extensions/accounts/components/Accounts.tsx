import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './Accounts.module.scss';
import { IAccount } from '../../../interfaces/IARInvoice';

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
      <div className={styles.cell}>
        {
          this.props.accounts ?
            <div>
              {this.props.accounts.map(account => {
                return (
                  <div>
                    <p>{account.Account_x0020_Code} | {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.Total_x0020_Invoice)}</p>
                  </div>
                );
              })}
            </div> :
            undefined
        }
      </div>
    );
  }
}

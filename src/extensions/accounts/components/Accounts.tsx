import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './Accounts.module.scss';

export interface IAccountsProps {
  text: string;
}

const LOG_SOURCE: string = 'Accounts';

export default class Accounts extends React.Component<IAccountsProps, {}> {
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
        { this.props.text }
      </div>
    );
  }
}

import * as React from 'react';
import styles from './ArInvoiceDetails.module.scss';
import { IArInvoiceDetailsProps } from './IArInvoiceDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ArInvoiceDetails extends React.Component<IArInvoiceDetailsProps, {}> {
  public render(): React.ReactElement<IArInvoiceDetailsProps> {
    return (
      <div className={ styles.arInvoiceDetails }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

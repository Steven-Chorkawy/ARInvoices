import * as React from 'react';

export interface IMyDateProps {
    date: string;
    format?: any;
    locale?: any;
}

export default class MyDate extends React.Component<IMyDateProps, any> {
    public render() {
        return (<span>{new Date(this.props.date).toLocaleDateString(this.props.locale ? this.props.locale : 'en-US')}</span>);
    }
}
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { MyLists } from '../enums/MyLists';
import { IARInvoice, ISaveARInvoice } from '../interfaces/IARInvoice';

export const CreateARInvoice = async (data: any) => {
    const { AccountCodes, Attachments, Customer, ApproverEmails, Invoice } = data;
    debugger;

    sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(Invoice).then(value => {
        alert('It from CreateARInvoice!');
    }).catch(error => {
        console.log(error);
        alert('CreateARInvoice failed....');
    });
};
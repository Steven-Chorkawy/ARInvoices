import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { MyLists } from '../enums/MyLists';
import { IARInvoice, ISaveARInvoice } from '../interfaces/IARInvoice';

export const UploadARInvoiceAttachment = async (attachment: any, arInvoiceId: number) => {
    debugger;
    let item = await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(arInvoiceId).get();
    // TODO: What happens when this item is not found? 

    item.attachmentFiles.add("file2.txt", "Here is my content").then(v => {
        debugger;
        console.log(v);
    });
}


export const CreateARInvoice = async (data: any) => {
    const { AccountCodes, Attachments, Customer, ApproverEmails, Invoice } = data;

    sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(Invoice).then(value => {
        alert('It from CreateARInvoice!');
        return 'it has been done!';
    }).catch(error => {
        console.log(error);
        alert('CreateARInvoice failed....');
        return 'it has been done!';
    });
};


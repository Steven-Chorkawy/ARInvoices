import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

import { MyLists } from '../enums/MyLists';

export const UploadARInvoiceAttachments = async (attachments: any[], arInvoiceId: number): Promise<void> => {
    if (!attachments) {
        return null;
    }

    let item = await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(arInvoiceId);

    for (let attachmentIndex = 0; attachmentIndex < attachments.length; attachmentIndex++) {
        const attachment = attachments[attachmentIndex];
        await item.attachmentFiles.add(attachment.name, attachment.getRawFile());
    }
};

export const CreateARInvoiceAccounts = async (accounts: any[], arInvoiceId: number): Promise<void> => {
    if (!accounts) {
        return null;
    }

    let accountList = sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]);
    let arInvoiceRequestList = sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]);
    let accountResults = [];  // This is what will be returned. 

    for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
        const account = { ...accounts[accountIndex], AR_x0020_InvoiceId: arInvoiceId };
        // Create the AR Invoice Account. 
        let itemAddResult = accountList.items.add(account);
        accountResults.push((await itemAddResult).data);
    }

    // Add the accounts to the AR Invoice Request.
    if (accountResults.length > 0) {
        arInvoiceRequestList.items.getById(arInvoiceId).update({
            AccountsId: { 'results': accountResults.map(a => { return a.Id; }) }
        });
    }
};

export const CreateARInvoice = async (data: any) => {
    console.log(data);
    const { AccountCodes, Attachments, Customer, ApproverEmails, Invoice } = data;

    let itemAddResult = await sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(Invoice);
    let newARInvoice = (await itemAddResult).data;

    // Append the ID to the title so users can determine which invoice they're looking at in the approval center.
    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(newARInvoice.ID).update({ Title: `${newARInvoice.Title} - ${newARInvoice.ID}` });

    await UploadARInvoiceAttachments(Attachments, newARInvoice.ID);
    await CreateARInvoiceAccounts(AccountCodes, newARInvoice.ID);

    debugger;
};


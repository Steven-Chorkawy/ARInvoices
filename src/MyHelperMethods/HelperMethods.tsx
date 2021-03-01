
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { MyLists } from '../enums/MyLists';

export const GetChoiceFieldValues = async (listName: MyLists, internalNameOrTitle: string): Promise<any[]> => {
    let field: any = await sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(internalNameOrTitle).select('Choices').get();
    return field.Choices;
};

/**
 * Build a URL to access a document. 
 * @param documentTitle Title of the document.
 * @param documentLibrary Name of the Document Library.  Default MyLists["Related Invoice Attachments"].
 */
export const BuildURLToDocument = async (documentTitle: string, invoiceID: number, webInfoUrl: string): Promise<string> => {
    //https://claringtonnet.sharepoint.com/sites/ARTest2/Lists/AR%20Invoice%20Requests/Attachments/73/AR%20Retention%20Meeting%20Aug%2018.docx?web=1
    return `${webInfoUrl}/Lists/${encodeURI(MyLists["AR Invoice Requests"])}/Attachments/${invoiceID}//${encodeURI(documentTitle)}?web=1`;
};



const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  
/**
 * Generate a random GUID string.
 */
export const BuildGUID = () => {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  };
  

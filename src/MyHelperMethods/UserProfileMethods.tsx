import { sp } from "@pnp/sp";



/**
* Get user profile details.
* @param loginName A Users LoginName
* @param callBack Call Back method is passed the users profile.
*/
export const GetUserProfile = async (loginName: string, callBack: Function) => {
    sp.profiles.getPropertiesFor(loginName).then(userProfileRes => {
      // This converts UserProfileProperties from an array of key value pairs [{Key:'', Value: ''},{Key:'', Value: ''}]
      // Into an array of objects [{'Key': 'Value'}, {'Key: 'Value'}]
      let props = {};
      userProfileRes.UserProfileProperties.map(p => {
        props[p.Key] = p.Value;
      });
      userProfileRes['Props'] = { ...props };
  
      callBack(userProfileRes);
    });
  };
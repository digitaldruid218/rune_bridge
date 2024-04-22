import {ObjectId} from "mongodb";
import {BidEventModel} from "~/server/models/BidsEvent.schema";

export default defineEventHandler(async (event) => {
  try {
    // const id = '64f82d800b44c3fa603bd847';
    const query = getQuery(event)
    const versionID = query.versionID? query.versionID : 3;
    if(query.userAddress){
      const temp = await BidEventModel.find({Slug:event.context.params?._slug, Version: versionID, UserAddress: query.userAddress});
      return temp;
    }else {
      const temp = await BidEventModel.find({Slug:event.context.params?._slug, Version: versionID});
      return temp;
    }
  }
  catch (error) {
    return error
  }
})

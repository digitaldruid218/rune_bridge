import {RiskManagerEventModel} from "~/server/models/RiskManagerEvent.schema";
import {BidEventModel} from "~/server/models/BidsEvent.schema";

export default defineEventHandler(async (event) => {
  try {const query = getQuery(event)
    const versionID = query.versionID? query.versionID : 3;
    if(query.userAddress){
      const temp = await BidEventModel.find({Version: versionID, UserAddress: query.userAddress});
      return temp;
    }else {
      const temp = await BidEventModel.find({Version: versionID});
      return temp;
    }
  }
  catch (error) {
    return error
  }
})

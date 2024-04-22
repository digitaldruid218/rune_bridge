import {BidEventModel} from "~/server/models/BidsEvent.schema";
export default defineEventHandler(async (event) => {
  try {

    //TODO SignHash, SignMessage 검증해서 맞는 경우만 create 해주기

    const query = getQuery(event)
    const versionID = query.versionID? query.versionID : 3;
    const body = await readBody(event);
    const temp = await BidEventModel.create({
      Version: versionID,
      UserAddress: body.UserAddress,
      Slug: body.Slug,
      InputAmount: body.InputAmount,
      InputPrice: body.InputPrice,
      Due: body.Due,
      BlockNumber: body.BlockNumber,
      SignHash: body.SignHash,
      SignMessage: body.SignMessage,
      Action: body.Action,
    })

    return temp;
  }
  catch (error) {
    return error
  }
})

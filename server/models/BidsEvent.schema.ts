import * as mongoose from "mongoose";
import {Double, ObjectId} from "mongodb";

export const BidEventSchema= new mongoose.Schema({
  // _id: {
  //   type: ObjectId,
  //   required: false
  // },
  Version: {
    type: Number,
    required: true
  },
  UserAddress: {
    type: String,
    required: true
  },
  Slug: {
    type: String,
    required: true
  },
  InputAmount: {
    type: Number,
    required: true
  },
  InputPrice: {
    type: Number,
    required: true
  },
  Due: {
    type: Date,
    required: false
  },
  BlockNumber: {
    type: Number,
    required: true
  },
  SignHash: {
    type: String,
    required: true
  },
  SignMessage: {
    type: String,
    required: true
  },
  Action: {
    type: String,
    required: true
  },
  Timestamp: {
    type: Date,
    default: Date.now
}
});

export const BidEventModel = mongoose.model('BidEvent', BidEventSchema, 'BidEvent');

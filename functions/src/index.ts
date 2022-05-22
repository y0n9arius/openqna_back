import {Request} from "firebase-functions";
import {Response} from "express";

import functions = require("firebase-functions");
import admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.setChannel = functions.https.onRequest(
    async (request: Request, response: Response) => {
      const channelCode = Math.random().toString(16).substring(2, 8);
      const isDuplicateCode = await db.collection("channel")
          .where("code", "==", channelCode)
          .get();
      if (isDuplicateCode) {
        response.send("채널을 생성할 수 없습니다.");
      }

      const data = {
        name: "ChannelName" + channelCode,
        code: channelCode,
        created_date: Date.now(),
      };

      await db.collection("channel").doc().set(data);
      response.send(channelCode);
    }
);

exports.getChannel = functions.https.onRequest(
    async (request: Request, response: Response) => {
      response.set("Access-Control-Allow-Origin", "*");

      const channels = await db.collection("channel").get();
      const channelNames: any[] = [];
      channels.forEach((doc: any) => {
        channelNames.push(doc.data());
      });
      response.send(channelNames);
    }
);

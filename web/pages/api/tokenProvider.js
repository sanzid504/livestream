
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = "dwpb5wgp6qnd";
const secret = "yqtckyhxja4wd4azhduqfcv8wjvbhsj8we4mcky6bnzvfr4dnm9c36v7yez9k6rk";

const client = new StreamClient(apiKey, secret, { timeout: 3000 });

export default async function handler(req, res) {
  try {
    const { user_id } = req.query;
    const token = client.createCallToken(user_id);

    res.status(200).json({ token });
  } catch (e) {
    console.log(e);
  }
}

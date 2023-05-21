import axios from "axios";
import { NextApiHandler } from "next";
import invariant from "tiny-invariant";

const STEAM_API_KEY = process.env.STEAM_API_KEY || "";

const getSteamGames = (steamId: string) =>
  axios.get(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );

const handler: NextApiHandler = async (req, res) => {
  const { id, serviceId } = req.query;

  if (!serviceId) {
    res.status(400).json({ message: "Missing serviceId" });
    return;
  }

  invariant(typeof id === "string", "id must be a string");

  let response;

  switch (serviceId) {
    case "steam":
      response = await getSteamGames(id);
      break;

    default:
      res.status(400).json({ message: "Invalid serviceId" });
      return;
  }

  res.status(200).json(response.data);
};

export default handler;

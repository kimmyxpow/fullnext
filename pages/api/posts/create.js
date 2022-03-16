import db from "../../../libs/db";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    await authorization(req, res);

    const { title, content } = req.body;

    const create = await db("posts").insert({ title, content });

    const createdData = await db("posts").where("id", create).first();

    res.status(200);
    res.json({
        message: "Posts created successfuly",
        data: createdData,
    });
}

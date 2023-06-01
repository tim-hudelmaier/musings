import clientPromise from '../../lib/mongodb';
import { getSession } from "next-auth/react"

export default async (req, res) => {
    const session = await getSession( { req } )

    if (!session) {
            res.status(401).json({ success: false, message: "Not Authenticated" });
            return;
    }

    const client = await clientPromise;
    const db = client.db();

    const notes = await db
        .collection("notes")
        .find({user_id: session.user.email})
        .toArray();

    res.status(200).json(notes);
}

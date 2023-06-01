import clientPromise from '../../lib/mongodb';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ success: false, message: "Not Authenticated" });
        return;
    }

    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const { uuid, date, note, user_id } = req.body;

                const client = await clientPromise;
                const db = client.db();

                // Insert the new note in the database
                await db.collection("notes").insertOne({ uuid, date, note, user_id });

                res.status(201).json({ success: true });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Server Error' });
            }
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

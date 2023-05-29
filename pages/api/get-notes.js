import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
    const client = await clientPromise;
    const db = client.db();

    const notes = await db.collection("notes").find({}).toArray();

    res.status(200).json(notes);
};

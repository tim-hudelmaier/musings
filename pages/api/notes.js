import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const { uuid, date, note } = req.body;

                const client = await clientPromise;
                const db = client.db();

                // Insert the new note in the database
                await db.collection("notes").insertOne({ uuid, date, note });

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
